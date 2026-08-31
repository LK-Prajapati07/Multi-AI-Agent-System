import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  Bot,
  User,
  Copy,
  Check,
  Code2,
  FileCode2,
  ImageIcon,
  Download,
} from "lucide-react";
import { useState } from "react";

const MessageBubble = ({
  role,
  content,
  artifacts = [],
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
            <>
              {/* =====================================
                  Normal AI Response
              ===================================== */}

              {content && (
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
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");

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

                      table: ({ children }) => (
                        <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
                          <table className="w-full text-sm border-collapse">
                            {children}
                          </table>
                        </div>
                      ),

                      thead: ({ children }) => (
                        <thead className="bg-white/10">{children}</thead>
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

                      pre: ({ children }) => <div className="my-4">{children}</div>,

                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-white/30 pl-4 my-3 italic text-white/80">
                          {children}
                        </blockquote>
                      ),

                      hr: () => <hr className="my-4 border-white/10" />,

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

              {/* =====================================
                  Generated Artifacts
              ===================================== */}

              {artifacts.length > 0 && <ArtifactViewer artifacts={artifacts} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==================================================
   Artifact Viewer (dispatches by artifact.type)
================================================== */

const ArtifactViewer = ({ artifacts }) => {
  if (!artifacts?.length) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      {artifacts.map((artifact, idx) => {
        const key = artifact.id ?? artifact.filename ?? idx;

        if (artifact.type === "image") {
          return <ImageArtifact key={key} artifact={artifact} />;
        }

        // default: treat as a code/project artifact (has `files`)
        return <ProjectArtifact key={key} artifact={artifact} />;
      })}
    </div>
  );
};

/* ==================================================
   Image Artifact
================================================== */

const ImageArtifact = ({ artifact }) => {
  const { url, filename, prompt } = artifact;

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-2">
          <ImageIcon size={17} className="text-emerald-300" />
          <span className="text-sm font-medium">Image</span>
        </div>

        {url && (
          <a
            href={url}
            download={filename || "image.png"}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-1.5
              text-xs text-white/60
              hover:text-white
              transition-colors
            "
          >
            <Download size={13} />
            Download
          </a>
        )}
      </div>

      {/* Image */}
      {url ? (
        <img
          src={url}
          alt={prompt || filename || "Generated image"}
          loading="lazy"
          className="w-full h-auto max-h-130 object-contain bg-black/30"
        />
      ) : (
        <div className="p-4 text-xs text-white/50">Image unavailable</div>
      )}

      {/* Filename */}
      {filename && (
        <div className="px-4 py-2 text-xs text-white/50 font-mono truncate">
          {filename}
        </div>
      )}
    </div>
  );
};

/* ==================================================
   Project / Code Artifact
================================================== */

const ProjectArtifact = ({ artifact }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20">
      {/* Artifact Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-2">
          <Code2 size={17} className="text-emerald-300" />
          <span className="text-sm font-medium">{artifact.type || "Project"}</span>
        </div>

        <span className="text-xs text-white/50">
          {artifact.files?.length ?? 0} files
        </span>
      </div>

      {/* Files */}
      <div className="p-2 space-y-1">
        {artifact.files?.map((file) => {
          const isSelected = selectedFile?.name === file.name;

          return (
            <button
              key={file.name}
              type="button"
              onClick={() => {
                setSelectedFile(file);
                setShowCode(true);
              }}
              className={`
                w-full
                flex
                items-center
                gap-2
                px-3
                py-2
                rounded-lg
                text-left
                transition
                ${
                  isSelected
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <FileCode2 size={15} className="text-blue-300 shrink-0" />
              <span className="text-xs font-mono">{file.name}</span>
            </button>
          );
        })}

        {!artifact.files?.length && (
          <div className="px-3 py-2 text-xs text-white/40">No files</div>
        )}
      </div>

      {/* Code Viewer */}
      {showCode && selectedFile && (
        <div className="border-t border-white/10">
          {/* File Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-black/30">
            <div className="flex items-center gap-2">
              <FileCode2 size={15} className="text-blue-300" />
              <span className="text-xs font-mono">{selectedFile.name}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowCode(false)}
              className="text-xs text-white/50 hover:text-white"
            >
              Close
            </button>
          </div>

          {/* Code */}
          <ArtifactCode file={selectedFile} />
        </div>
      )}
    </div>
  );
};

/* ==================================================
   Artifact Code Viewer
================================================== */

const ArtifactCode = ({ file }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const getLanguage = (fileName) => {
    if (fileName.endsWith(".html")) return "html";
    if (fileName.endsWith(".css")) return "css";
    if (fileName.endsWith(".js")) return "javascript";
    if (fileName.endsWith(".jsx")) return "jsx";
    if (fileName.endsWith(".ts")) return "typescript";
    if (fileName.endsWith(".tsx")) return "tsx";
    return "text";
  };

  const language = getLanguage(file.name);

  return (
    <div className="relative">
      {/* Copy Button */}
      <button
        type="button"
        onClick={copyCode}
        className="
          absolute
          right-3
          top-3
          z-10
          flex
          items-center
          gap-1.5
          px-2
          py-1.5
          rounded-md
          bg-white/10
          hover:bg-white/20
          text-xs
          text-white/70
          hover:text-white
        "
      >
        {copied ? (
          <>
            <Check size={13} />
            Copied
          </>
        ) : (
          <>
            <Copy size={13} />
            Copy
          </>
        )}
      </button>

      <div className="max-h-125 overflow-auto">
        <SyntaxHighlighter
          language={language}
          customStyle={{
            margin: 0,
            padding: "16px",
            paddingTop: "48px",
            background: "#0b0d12",
            fontSize: "12px",
            lineHeight: "1.6",
          }}
          codeTagProps={{
            style: {
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            },
          }}
        >
          {file.content}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

/* ==================================================
   Normal Markdown Code Block
================================================== */

const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-white/10 bg-[#282c34]">
      <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/10">
        <span className="text-xs font-mono text-white/60 uppercase">{language}</span>

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

/* ==================================================
   Thinking Indicator
================================================== */

const ThinkingIndicator = () => {
  return (
    <div className="flex items-center gap-2 min-w-30">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce" />
      </div>

      <span className="text-xs text-white/70">AI is thinking...</span>
    </div>
  );
};

export default MessageBubble;
