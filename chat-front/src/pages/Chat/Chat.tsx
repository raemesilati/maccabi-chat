import ChatContainer from "../../components/ChatContainer/ChatContainer";
import UsersList from "../../components/UserList/UserList";
import { IMessage } from "./chat.interface";
import useChat from "./useChat";
import classes from "./Chat.module.scss";
import useScreenBehaviors from "../../hooks/useScreenBehaviors";

const ChatPage = () => {
  const {
    userContext,
    users,
    messages,
    conversationId,
    logout,
    handleConversationSelect,
    handleSend,
    handleBack,
  } = useChat();

  const { isDesktopView } = useScreenBehaviors();

  return (
    <div className={classes.chatPage}>
      {userContext &&
        (isDesktopView ? (
          <>
            <UsersList
              users={users}
              onClick={handleConversationSelect}
              currentUser={userContext.user}
              messages={messages}
              logout={logout}
              conversationId={conversationId}
            />
            {conversationId ? (
              <ChatContainer
                messages={messages.filter(
                  (message: IMessage) =>
                    message.recipient === conversationId ||
                    message.sender === conversationId
                )}
                onSend={handleSend}
                currentUser={userContext.user}
                onBack={handleBack}
              />
            ) : (
              <p className={classes.chooseChat}>אנא בחר שיחה</p>
            )}
          </>
        ) : (
          <>
            {conversationId ? (
              <ChatContainer
                messages={messages.filter(
                  (message: IMessage) =>
                    message.recipient === conversationId ||
                    message.sender === conversationId
                )}
                onSend={handleSend}
                currentUser={userContext.user}
                onBack={handleBack}
              />
            ) : (
              <UsersList
                users={users}
                onClick={handleConversationSelect}
                currentUser={userContext.user}
                messages={messages}
                logout={logout}
                conversationId={conversationId}
              />
            )}
          </>
        ))}
    </div>
  );
};

export default ChatPage;
