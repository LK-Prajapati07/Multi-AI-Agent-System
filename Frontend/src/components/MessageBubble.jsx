import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";

const MessageBubble = ({
  role,
  content,
  isThinking = false,
}) => {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      } animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`flex gap-2.5 max-w-[92%] md:max-w-[80%] ${
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
          className={`relative px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed shadow-lg min-w-0 ${
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
                prose
                prose-sm
                prose-invert
                max-w-none

                prose-p:my-2
                prose-p:leading-7

                prose-headings:font-semibold
                prose-headings:text-white
                prose-headings:mt-5
                prose-headings:mb-3

                prose-h1:text-2xl
                prose-h2:text-xl
                prose-h3:text-lg

                prose-ul:my-3
                prose-ol:my-3
                prose-li:my-1

                prose-strong:text-white

                prose-a:text-blue-300
                prose-a:no-underline
                hover:prose-a:underline

                prose-code:text-emerald-200
                prose-code:bg-black/20
                prose-code:px-1
                prose-code:py-0.5
                prose-code:rounded

                prose-pre:bg-transparent
                prose-pre:p-0
                prose-pre:m-0
              "
            >
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  /* --------------------------------
                     Inline Code
                  -------------------------------- */
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(
                      className || ""
                    );

                    if (!inline && match) {
                      return (
                        <CodeBlock
                          language={match[1]}
                          value={String(children).replace(/\n$/, "")}
                        />
                      );
                    }

                    return (
                      <code
                        className="
                          bg-black/30
                          text-emerald-200
                          px-1.5
                          py-0.5
                          rounded
                          text-[12px]
                          font-mono
                        "
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },

                  /* --------------------------------
                     Table
                  -------------------------------- */
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
                      <table className="w-full text-sm border-collapse">
                        {children}
                      </table>
                    </div>
                  ),

                  thead: ({ children }) => (
                    <thead className="bg-white/10">
                      {children}
                    </thead>
                  ),

                  th: ({ children }) => (
                    <th className="px-3 py-2 text-left font-semibold border-b border-white/10 whitespace-nowrap">
                      {children}
                    </th>
                  ),

                  td: ({ children }) => (
                    <td className="px-3 py-2 align-top border-b border-white/10">
                      {children}
                    </td>
                  ),

                  /* --------------------------------
                     Pre
                  -------------------------------- */
                  pre: ({ children }) => (
                    <div className="my-4">
                      {children}
                    </div>
                  ),

                  /* --------------------------------
                     Blockquote
                  -------------------------------- */
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-white/30 pl-4 my-3 italic text-white/80">
                      {children}
                    </blockquote>
                  ),

                  /* --------------------------------
                     Horizontal Line
                  -------------------------------- */
                  hr: () => (
                    <hr className="my-4 border-white/10" />
                  ),

                  /* --------------------------------
                     Links
                  -------------------------------- */
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200 underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {content}
              </Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


/* ================================================
   Code Block
================================================ */

const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-white/10 bg-[#282c34]">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/10">
        <span className="text-xs font-mono text-white/60 uppercase">
          {language}
        </span>

        <button
          onClick={copyCode}
          className="
            flex
            items-center
            gap-1.5
            text-xs
            text-white/60
            hover:text-white
            transition-colors
          "
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Syntax Highlighted Code */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          
          customStyle={{
            margin: 0,
            padding: "16px",
            background: "transparent",
            fontSize: "13px",
            lineHeight: "1.6",
          }}
          codeTagProps={{
            style: {
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            },
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};


/* ================================================
   Thinking Indicator
================================================ */

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