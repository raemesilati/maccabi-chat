import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { MessageStatusEnums } from "../../components/MessageStatus/MessageStatus";
import useAPIMutation from "../../hooks/useApi";
import { IUserDetails, useUser } from "../../contexts/userContext";
import { IMessage } from "./chat.interface";

const useChat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users, setUsers] = useState<IUserDetails[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { updateContext, userContext } = useUser();
  const { mutate: getUsers } = useAPIMutation("api/auth/users");
  const { mutate: getChats } = useAPIMutation("api/messages/chats");
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("http://localhost:5000", {
        auth: { token: userContext?.token },
        reconnection: true,
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, []); // Empty dependency array - only run once

  useEffect(() => {
    if (!socket.current) return;

    const handleMessage = (data: IMessage) => {
      if (data) {
        setMessages((prevMessages: IMessage[]) => {
          const messageExists = prevMessages.some((msg) => msg.id === data.id);

          if (messageExists) {
            return prevMessages.map((msg) =>
              msg.id === data.id ? { ...msg, ...data } : msg
            );
          } else {
            return [...prevMessages, data];
          }
        });

        if (conversationId === data.sender) {
          socket.current?.emit("read_message", data);
        } else {
          socket.current?.emit("delivered_message", data);
        }
      }
    };

    socket.current.on("receive_message", handleMessage);

    return () => {
      socket.current?.off("receive_message", handleMessage);
    };
  }, [conversationId]);

  const handleSend = (text: string) => {
    if (conversationId && userContext) {
      const messageData: IMessage = {
        recipient: conversationId,
        content: text.trim(),
        sender: userContext.user.id,
        status: MessageStatusEnums.SENT,
        id: Date.now().toString(),
        created: new Date().toISOString(),
        roomId: `${userContext?.user.id}-${conversationId}`,
      };
      socket.current?.emit("send_message", messageData);
    }
  };

  useEffect(() => {
    getUsers(
      { get: true },
      {
        onSuccess: (data: IUserDetails[]) => {
          setUsers(data);
        },
      }
    );

    getChats(
      { get: true },
      {
        onSuccess: (data) => {
          data.forEach((message: IMessage) => {
            if (
              message.recipient === userContext?.user.id &&
              message.status === MessageStatusEnums.SENT
            ) {
              socket.current?.emit("delivered_message", message);
            }
          });
          setMessages(data);
        },
      }
    );
  }, []);

  const logout = () => {
    updateContext(null);
  };

  const handleConversationSelect = (id: string) => {
    setConversationId(id);
    messages.forEach((message: IMessage) => {
      if (
        message.sender === id &&
        message.status === MessageStatusEnums.DELIVERED
      ) {
        socket?.current?.emit("read_message", message);
      }
    });
  };

  const handleBack = () => {
    setConversationId(null);
  };

  return {
    userContext,
    users,
    messages,
    conversationId,
    logout,
    handleConversationSelect,
    handleSend,
    handleBack,
  };
};

export default useChat;
