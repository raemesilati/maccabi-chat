import React from "react";
import classes from "./MessageStatus.module.scss";

// Define and export the enum
export enum MessageStatusEnums {
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
}

// Props interface using the enum
interface MessageStatusProps {
  status: MessageStatusEnums;
}

const MessageStatusComponent: React.FC<MessageStatusProps> = ({ status }) => {
  switch (status) {
    case MessageStatusEnums.READ:
      return <div className={`${classes.status} ${classes.read}`}>✓✓</div>;
    case MessageStatusEnums.DELIVERED:
      return <div className={classes.status}>✓✓</div>;
    case MessageStatusEnums.SENT:
      return <div className={classes.status}>✓</div>;
    default:
      return null;
  }
};

export default MessageStatusComponent;
