import { useSelector } from "react-redux";
import CosmicHome from "./CosmicHome";
import MessageBubble from "./MessageBubble";

const MessageList = () => {
  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const { Message } = useSelector(
    (state) => state.message
  );

  return (
    <div className="flex-1 overflow-hidden">
      {!selectedConversation ? (
        <CosmicHome />
      ) : !Message?.length ? (
        <div className="h-full flex items-center justify-center text-slate-500">
          No messages yet
        </div>
      ) : (
        <div className="h-full overflow-y-auto px-6 py-6 space-y-5">
          {Message.map((msg,i) => (
            <div
              key={i}
              className="text-slate-200"
            >
            <MessageBubble role={msg?.role} content={msg?.content}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageList;