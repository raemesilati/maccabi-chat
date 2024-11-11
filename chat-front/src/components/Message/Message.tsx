import moment from "moment";
import React from "react";
import { IUserDetails } from "../../contexts/userContext";
import MessageStatus from "../MessageStatus/MessageStatus";
import { IMessage } from "./../../pages/Chat/chat.interface";
import classes from "./Message.module.scss";

interface ChatMessagesProps extends IMessage {
  currentUser: IUserDetails;
}

const Message: React.FC<ChatMessagesProps> = ({
  content,
  status,
  created,
  currentUser,
  sender,
}: ChatMessagesProps) => {
  return (
    <div
      className={`${classes.message} ${
        currentUser.id == sender ? classes.current : ""
      }`}
    >
      <p>
        <span>{content}</span>
        <div className={classes.messageInfo}>
          <span className={classes.date}>
            {moment(created).isSame(moment(), "day")
              ? moment(created).format("HH:mm")
              : moment(created).format("DD/MM/YYYY HH:mm")}
          </span>
          {currentUser.id == sender && <MessageStatus status={status} />}
        </div>
      </p>
    </div>
  );
};

export default Message;
