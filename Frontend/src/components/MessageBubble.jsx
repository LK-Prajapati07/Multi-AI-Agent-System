import Markdown from "react-markdown";
import { Bot, User } from "lucide-react";

const MessageBubble = ({ role, content, isThinking = false }) => {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      } animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`flex gap-2.5 max-w-[85%] md:max-w-[72%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? "bg-indigo-500/20 border border-indigo-400/20"
              : "bg-emerald-500/20 border border-emerald-400/20"
          }`}
        >
          {isUser ? (
            <User size={15} className="text-indigo-300" />
          ) : (
            <Bot size={15} className="text-emerald-300" />
          )}
        </div>

        {/* Message */}
        <div
          className={`relative px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed shadow-lg ${
            isUser
              ? "bg-linear-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
              : "bg-linear-to-br from-emerald-500/90 to-green-700/90 text-white rounded-tl-sm"
          }`}
        >
          {isThinking ? (
            <ThinkingIndicator />
          ) : (
            <div
              className="
                prose prose-sm prose-invert max-w-none
                prose-p:my-1.5
                prose-headings:mt-3 prose-headings:mb-2
                prose-ul:my-2
                prose-ol:my-2
                prose-li:my-0.5
                prose-code:text-emerald-200
                prose-pre:bg-black/30
                prose-pre:border prose-pre:border-white/10
              "
            >
              <Markdown>{content}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ThinkingIndicator = () => {
  return (
    <div className="flex items-center gap-2 min-w-30">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce" />
      </div>

      <span className="text-xs text-white/70">
        AI is thinking...
      </span>
    </div>
  );
};

export default MessageBubble;