import { useSelector } from "react-redux";

const MessageList = () => {
  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const { Message } = useSelector(
    (state) => state.message
  );

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 scrollbar-none [&::-webkit-scrollbar]:hidden">

      {!selectedConversation ? (
        <div className="h-full flex items-center justify-center text-slate-500">
          Select a conversation
        </div>
      ) : !Message?.length ? (
        <div className="h-full flex items-center justify-center text-slate-500">
          No messages yet
        </div>
      ) : (
        <div>
          {Message.map((message) => (
            <div key={message._id}>
              {message.content}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MessageList;