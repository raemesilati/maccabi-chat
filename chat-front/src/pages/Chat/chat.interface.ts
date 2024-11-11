// Import the enum type
import { MessageStatusEnums } from "../../components/MessageStatus/MessageStatus";

export interface IMessage {
  id: string;
  content: string;
  created: string;
  sender: string;
  recipient: string;
  status: MessageStatusEnums; // Use the enum type
  roomId: string;
}

export interface IChat {
  roomId: string;
  user: string;
  messages: IMessage[];
}
