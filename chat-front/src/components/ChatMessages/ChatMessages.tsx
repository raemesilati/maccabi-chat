// ChatMessages.tsx
import React from "react";
import { IUserDetails } from "../../contexts/userContext";
import Message from "../Message/Message";
import { IMessage } from "./../../pages/Chat/chat.interface";
import classes from "./ChatMessages.module.scss";
import { useRef } from "react";
import { useEffect } from "react";
import { useCallback } from "react";

interface ChatMessagesProps {
  messages: IMessage[];
  currentUser: IUserDetails;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  currentUser,
}) => {
  const messagesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scroll({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <ul className={classes.chatMessages} ref={messagesRef}>
      {messages.map((message: IMessage) => (
        <li key={message.id}>
          <Message {...message} currentUser={currentUser} />
        </li>
      ))}
    </ul>
  );
};

export default ChatMessages;
