const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const { authenticateSocket } = require("./middleware/auth");
const Database = require("./utils/database");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const connectedUsers = new Map();

io.use(authenticateSocket);

io.on("connection", (socket) => {
  const userId = socket.user.id;
  connectedUsers.set(userId, socket.id);

  socket.on("send_message", async (messageData) => {
    const recipientSocketId = connectedUsers.get(messageData.recipient);
    try {
      let savedMessage = await Database.createMessage(messageData);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receive_message", savedMessage);
      } else {
        socket.emit("receive_message", savedMessage);
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  socket.on("delivered_message", async (messageData) => {
    const recipientSocketId = connectedUsers.get(messageData.recipient);
    const senderSocketId = connectedUsers.get(messageData.sender);
    if (recipientSocketId && messageData.status === "sent") {
      savedMessage = await Database.updateMessageStatus(
        messageData.id,
        "delivered"
      );
      io.to([senderSocketId, recipientSocketId]).emit(
        "receive_message",
        savedMessage
      );
    }
  });

  socket.on("read_message", async (messageData) => {
    const recipientSocketId = connectedUsers.get(messageData.recipient);
    const senderSocketId = connectedUsers.get(messageData.sender);
    if (recipientSocketId) {
      savedMessage = await Database.updateMessageStatus(messageData.id, "read");
      io.to([senderSocketId, recipientSocketId]).emit(
        "receive_message",
        savedMessage
      );
    }
  });

  socket.on("disconnect", () => {
    connectedUsers.delete(userId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
