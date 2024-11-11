const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");
const crypto = require("crypto");

class Database {
  constructor() {
    this.USERS_FILE = path.join(__dirname, "../data/users.json");
    this.MESSAGES_FILE = path.join(__dirname, "../data/messages.json");
    this.LOCK_FILE = path.join(__dirname, "../data/db.lock");

    this.cache = {
      users: null,
      messages: null,
    };

    this.writeQueue = [];
    this.isWriting = false;
    this.lockTimeout = 10000; // 10 seconds
    this.retryInterval = 100; // 100ms

    this.initializeDatabase();
  }

  async initializeDatabase() {
    try {
      const dataDir = path.dirname(this.USERS_FILE);
      await fs.mkdir(dataDir, { recursive: true });

      try {
        await fs.unlink(this.LOCK_FILE);
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.error("Error cleaning up stale lock:", error);
        }
      }

      await this.safeReadJSON(this.USERS_FILE);
      await this.safeReadJSON(this.MESSAGES_FILE);
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }

  async safeReadJSON(filePath) {
    try {
      const data = await fs.readFile(filePath, "utf8");
      if (!data || !data.trim()) {
        return await this.initializeFile(filePath);
      }
      const parsedData = JSON.parse(data);
      return parsedData.data ? parsedData : { version: 1, data: parsedData };
    } catch (error) {
      if (error.code === "ENOENT" || error instanceof SyntaxError) {
        return await this.initializeFile(filePath);
      }
      throw error;
    }
  }

  async initializeFile(filePath) {
    const initialData = { version: 1, data: [] };
    await fs.writeFile(filePath, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }

  isLockStale() {
    try {
      const stats = fsSync.statSync(this.LOCK_FILE);
      const now = new Date().getTime();
      const lockAge = now - stats.mtimeMs;
      return lockAge > this.lockTimeout;
    } catch (error) {
      return true;
    }
  }

  async acquireLock() {
    const startTime = Date.now();

    while (true) {
      try {
        const fd = await fs.open(this.LOCK_FILE, "wx");
        await fd.close();
        return true;
      } catch (error) {
        if (this.isLockStale()) {
          try {
            await fs.unlink(this.LOCK_FILE);
            continue;
          } catch (unlinkError) {
            if (unlinkError.code !== "ENOENT") {
              console.error("Error removing stale lock:", unlinkError);
            }
          }
        }

        if (Date.now() - startTime > this.lockTimeout) {
          throw new Error("Lock acquisition timeout");
        }

        await new Promise((resolve) => setTimeout(resolve, this.retryInterval));
      }
    }
  }

  async releaseLock() {
    try {
      await fs.unlink(this.LOCK_FILE);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Error releasing lock:", error);
      }
    }
  }

  async safeWriteJSON(filePath, newData) {
    let lockAcquired = false;
    try {
      await this.acquireLock();
      lockAcquired = true;

      const currentContent = await this.safeReadJSON(filePath);
      const updatedContent = {
        version: (currentContent.version || 0) + 1,
        data: newData,
        checksum: this.calculateChecksum(newData),
      };

      const tempFile = `${filePath}.tmp`;
      await fs.writeFile(tempFile, JSON.stringify(updatedContent, null, 2));

      const written = await fs.readFile(tempFile, "utf8");
      const parsedWritten = JSON.parse(written);

      if (
        this.calculateChecksum(parsedWritten.data) !== updatedContent.checksum
      ) {
        throw new Error("Data integrity check failed");
      }

      await fs.rename(tempFile, filePath);
      return true;
    } finally {
      if (lockAcquired) {
        await this.releaseLock();
      }
    }
  }

  calculateChecksum(data) {
    return crypto.createHash("md5").update(JSON.stringify(data)).digest("hex");
  }

  async queueWrite(operation) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const index = this.writeQueue.findIndex(
          (item) => item.operation === operation
        );
        if (index !== -1) {
          this.writeQueue.splice(index, 1);
          reject(new Error("Write operation timeout"));
        }
      }, this.lockTimeout);

      this.writeQueue.push({
        operation,
        resolve: (...args) => {
          clearTimeout(timeoutId);
          resolve(...args);
        },
        reject: (...args) => {
          clearTimeout(timeoutId);
          reject(...args);
        },
      });

      if (!this.isWriting) {
        this.processWriteQueue();
      }
    });
  }

  async processWriteQueue() {
    if (this.isWriting || this.writeQueue.length === 0) return;

    this.isWriting = true;
    const { operation, resolve, reject } = this.writeQueue.shift();

    try {
      const result = await operation();
      resolve(result);
    } catch (error) {
      console.error("Error processing write operation:", error);
      reject(error);
    } finally {
      this.isWriting = false;
      setImmediate(() => this.processWriteQueue());
    }
  }

  // User-related methods
  async getAllUsers() {
    try {
      if (this.cache.users) return this.cache.users;
      const result = await this.safeReadJSON(this.USERS_FILE);
      this.cache.users = result.data || [];
      return this.cache.users;
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  }

  async findUserByEmail(email) {
    try {
      const users = await this.getAllUsers();
      return users.find((user) => user.email === email) || null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      return null;
    }
  }

  async findUserById(id) {
    try {
      const users = await this.getAllUsers();
      return users.find((user) => user.id === id) || null;
    } catch (error) {
      console.error("Error finding user by id:", error);
      return null;
    }
  }

  async createUser(userData) {
    try {
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
      };

      return await this.queueWrite(async () => {
        const users = await this.getAllUsers();
        users.push(newUser);
        await this.safeWriteJSON(this.USERS_FILE, users);
        this.cache.users = users;
        return newUser;
      });
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Message-related methods
  async getAllMessages() {
    try {
      if (this.cache.messages) return this.cache.messages;
      const result = await this.safeReadJSON(this.MESSAGES_FILE);
      this.cache.messages = result.data || [];
      return this.cache.messages;
    } catch (error) {
      console.error("Error getting messages:", error);
      return [];
    }
  }

  async getMessagesByUser(userId) {
    try {
      const messages = await this.getAllMessages();
      return messages
        .filter(
          (message) =>
            message.sender === String(userId) ||
            message.recipient === String(userId)
        )
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } catch (error) {
      console.error("Error getting messages by user:", error);
      return [];
    }
  }

  async createMessage(messageData) {
    try {
      const newMessage = {
        id: Date.now().toString(),
        ...messageData,
        createdAt: new Date().toISOString(),
      };

      return await this.queueWrite(async () => {
        const messages = await this.getAllMessages();
        messages.push(newMessage);
        await this.safeWriteJSON(this.MESSAGES_FILE, messages);
        this.cache.messages = messages;
        return newMessage;
      });
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  }

  async updateMessageStatus(messageId, status) {
    try {
      return await this.queueWrite(async () => {
        const messages = await this.getAllMessages();
        const updatedMessages = messages.map((msg) =>
          msg.id === messageId ? { ...msg, status } : msg
        );
        await this.safeWriteJSON(this.MESSAGES_FILE, updatedMessages);
        this.cache.messages = updatedMessages;
        return updatedMessages.find((msg) => msg.id === messageId) || null;
      });
    } catch (error) {
      console.error("Error updating message status:", error);
      throw error;
    }
  }
}

// Export a singleton instance
module.exports = new Database();
// const fs = require("fs").promises;
// const path = require("path");

// const USERS_FILE = path.join(__dirname, "../data/users.json");
// const MESSAGES_FILE = path.join(__dirname, "../data/messages.json");

// class Database {
//   static async safeReadJSON(filePath) {
//     try {
//       const data = await fs.readFile(filePath, "utf8");
//       if (!data || !data.trim()) {
//         await fs.writeFile(filePath, "[]", "utf8");
//         return [];
//       }
//       return JSON.parse(data);
//     } catch (error) {
//       if (error.code === "ENOENT" || error instanceof SyntaxError) {
//         await fs.writeFile(filePath, "[]", "utf8");
//         return [];
//       }
//       throw error;
//     }
//   }

//   static async safeWriteJSON(filePath, data) {
//     try {
//       const jsonString = JSON.stringify(data, null, 2);
//       await fs.writeFile(filePath, jsonString, "utf8");
//     } catch (error) {
//       console.error(`Error writing to ${filePath}:`, error);
//       throw error;
//     }
//   }

//   static async getAllUsers() {
//     return this.safeReadJSON(USERS_FILE);
//   }

//   static async findUserByEmail(email) {
//     const users = await this.getAllUsers();
//     return users.find((user) => user.email === email);
//   }

//   static async findUserById(id) {
//     const users = await this.getAllUsers();
//     return users.find((user) => user.id === id);
//   }

//   static async createUser(userData) {
//     const users = await this.getAllUsers();
//     const newUser = {
//       id: Date.now().toString(),
//       ...userData,
//       createdAt: new Date().toISOString(),
//     };
//     users.push(newUser);
//     await this.safeWriteJSON(USERS_FILE, users);
//     return newUser;
//   }

//   static async getMessagesByUser(userId) {
//     const messages = await this.getAllMessages();
//     return messages
//       .filter(
//         (message) =>
//           message.sender === String(userId) ||
//           message.recipient === String(userId)
//       )
//       .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//   }

//   static async getAllMessages() {
//     return this.safeReadJSON(MESSAGES_FILE);
//   }

//   static async createMessage(messageData) {
//     const messages = await this.getAllMessages();
//     const newMessage = {
//       id: Date.now().toString(),
//       ...messageData,
//       createdAt: new Date().toISOString(),
//     };
//     messages.push(newMessage);
//     await this.safeWriteJSON(MESSAGES_FILE, messages);
//     return newMessage;
//   }

//   static async updateMessageStatus(messageId, status) {
//     const messages = await this.getAllMessages();
//     const updatedMessages = messages.map((msg) =>
//       msg.id === messageId ? { ...msg, status } : msg
//     );
//     await this.safeWriteJSON(MESSAGES_FILE, updatedMessages);
//     return updatedMessages.find((msg) => msg.id === messageId);
//   }
// }

// module.exports = Database;
