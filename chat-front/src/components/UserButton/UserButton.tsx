import { IUserDetails } from "../../contexts/userContext";
import classes from "./UserButton.module.scss";
import { IMessage } from "./../../pages/Chat/chat.interface";
import backIcon from "../../assets/icons/back.svg";

interface UserButtonProps {
  user: IUserDetails;
  onClick: Function;
  unread: IMessage[];
  conversationId: string | null;
}

const UserButton: React.FC<UserButtonProps> = ({
  user,
  onClick,
  unread,
  conversationId,
}) => {
  return (
    <button
      onClick={() => onClick(user.id)}
      title={`התחל/הכנס לשיחה עם ${user.fullName}`}
      className={`${classes.user} ${unread.length > 0 ? classes.bold : ""}`}
    >
      <img
        className={conversationId === user.id ? classes.current : ""}
        src={backIcon}
        alt=""
      />
      <span>{user.fullName}</span>
      {unread.length > 0 && conversationId !== user.id && (
        <div className={classes.unreadIndicator}>
          <span className={classes.unreadIndicatorCount}>{unread.length}</span>
          <span className={classes.unreadIndicatorDot} />
        </div>
      )}
    </button>
  );
};

export default UserButton;
