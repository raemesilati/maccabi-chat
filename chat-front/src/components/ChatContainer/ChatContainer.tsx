import React from "react";
import { IUserDetails } from "../../contexts/userContext";
import { IMessage } from "../../pages/Chat/chat.interface";
import ChatInput from "../ChatInput/ChatInput";
import ChatMessages from "../ChatMessages/ChatMessages";
import classes from "./ChatContainer.module.scss";
import backIcon from "../../assets/icons/back.svg";

interface IChatContainer {
  messages: IMessage[];
  onSend: Function;
  currentUser: IUserDetails;
  onBack: Function;
}

const ChatContainer: React.FC<IChatContainer> = ({
  messages,
  onSend,
  currentUser,
  onBack,
}) => {
  return (
    <div className={classes.chatContainer}>
      <button onClick={() => onBack()} className={classes.back}>
        <img src={backIcon} alt="" />
        חזור
      </button>
      <ChatMessages messages={messages} currentUser={currentUser} />
      <ChatInput onSend={onSend} />
    </div>
  );
};

export default ChatContainer;
