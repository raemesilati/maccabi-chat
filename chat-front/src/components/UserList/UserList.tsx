import React from "react";
import { IMessage } from "../../pages/Chat/chat.interface";
import { MessageStatusEnums } from "../MessageStatus/MessageStatus";
import UserButton from "../UserButton/UserButton";
import { IUserDetails } from "../../contexts/userContext";
import classes from "./UserList.module.scss";

interface UserListProps {
  users: IUserDetails[];
  currentUser: IUserDetails;
  onClick: Function;
  messages: IMessage[];
  logout: Function;
  conversationId: string | null;
}

const UsersList: React.FC<UserListProps> = ({
  users,
  onClick,
  currentUser,
  messages,
  logout,
  conversationId,
}) => {
  return (
    <div className={classes.usersList}>
      <div className={classes.usersListHeader}>
        <div> ברוך הבא, {currentUser.fullName}</div>
        <button onClick={() => logout()}>התנתקות</button>
      </div>
      <ul className={classes.users}>
        {users.filter((user: IUserDetails) => user.id !== currentUser.id)
          .length > 0 ? (
          users
            .filter((user: IUserDetails) => user.id !== currentUser.id)
            .map((user: IUserDetails) => (
              <li key={user.id}>
                <UserButton
                  onClick={onClick}
                  user={user}
                  conversationId={conversationId}
                  unread={messages.filter(
                    (message: IMessage) =>
                      message.sender === user.id &&
                      message.status === MessageStatusEnums.DELIVERED
                  )}
                />
              </li>
            ))
        ) : (
          <p className={classes.noUsers}>יש ליצור משתמשים</p>
        )}
      </ul>
    </div>
  );
};

export default UsersList;
