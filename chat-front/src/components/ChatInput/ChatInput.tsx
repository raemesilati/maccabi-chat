import React, { useState } from "react";
import classes from "./ChatInput.module.scss";
import sendIcon from "../../assets/icons/send.svg";

interface ChatInputProps {
  onSend: Function;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [text, setText] = useState<string>("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(text.trim());
    setText("");
  };

  return (
    <div className={classes.chatInput}>
      <form onSubmit={handleSend}>
        <input
          type="text"
          value={text}
          required
          onChange={(event) => {
            setText(event.target.value);
          }}
        />
        <button type="submit">
          <img src={sendIcon} alt="שלח" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
