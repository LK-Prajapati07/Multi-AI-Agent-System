import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  MessageSquare,
  Mic,
  Paperclip,
  Presentation,
  Send,
  X,
  Zap,
} from "lucide-react";
import { memo, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import callAgent from "../features/agent";
import {
  createConversation,
  updateConversationTitle,
} from "../features/CHATAPI/conversation.api";
import { addArtifact, addMessage } from "../store/MessageSlice";
import { setSelectedConversations } from "../store/conversation";

// Static, so it's defined once instead of being rebuilt on every render.
const AGENTS = [
  { id: "auto", icon: Zap, label: "Auto" },
  { id: "chat", icon: MessageSquare, label: "Chat" },
  { id: "coding", icon: Code2, label: "Coding" },
  { id: "ppt", icon: Presentation, label: "PPT" },
  { id: "vision", icon: ImageIcon, label: "Vision" },
  { id: "pdf", icon: FileText, label: "PDF" },
  { id: "search", icon: Globe, label: "Search" },
];

const ACCEPTED_FILE_TYPES = "application/pdf,image/*";

const AgentButton = memo(function AgentButton({ agent, isActive, onSelect }) {
  const Icon = agent.icon;

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => onSelect(agent.id)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border transition-all ${isActive
          ? "bg-white/10 border-white/20 text-white"
          : "bg-transparent border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300"
        }`}
    >
      <Icon size={14} />
      <span>{agent.label}</span>
    </button>
  );
});

/** Small chip showing the file staged for upload, with a remove control. */
const FileChip = memo(function FileChip({ file, onRemove }) {
  return (
    <div className="flex items-center gap-2 self-start bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-300">
      <Paperclip size={12} />
      <span className="max-w-50 truncate">{file.name}</span>
      <button
        type="button"
        aria-label="Remove attached file"
        onClick={onRemove}
        className="text-slate-500 hover:text-slate-200 transition"
      >
        <X size={12} />
      </button>
    </div>
  );
});

const ChatInput = () => {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);

  const [value, setValue] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("auto");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const fileRef = useRef(null);

  const canSend = (value.trim().length > 0 || selectedFile) && !isSending;

  const openFilePicker = useCallback(() => fileRef.current?.click(), []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
    e.target.value = ""; // allow re-selecting the same file later
  }, []);

  const clearSelectedFile = useCallback(() => setSelectedFile(null), []);

  /** Ensures a conversation exists, creating one if necessary. */
  const ensureConversation = useCallback(async () => {
    if (selectedConversation?._id) return selectedConversation;

    const response = await createConversation();
    const conversation = response?.data;

    if (!conversation?._id) {
      throw new Error("Conversation creation failed");
    }

    dispatch(setSelectedConversations(conversation));
    return conversation;
  }, [selectedConversation, dispatch]);

  /** Renames a freshly-created conversation using the first prompt sent to it. */
  const maybeRenameConversation = useCallback(
    async (conversation, title) => {
      if (conversation.title !== "new Chat" || !title) return conversation;

      try {
        const response = await updateConversationTitle({
          id: conversation._id,
          title,
        });
        if (response?.data) {
          dispatch(setSelectedConversations(response.data));
          return response.data;
        }
      } catch (err) {
        console.error("Title update failed:", err.response?.data || err.message);
      }

      return conversation;
    },
    [dispatch]
  );

  const handleSendMessage = useCallback(async () => {
    const prompt = value.trim();
    if ((!prompt && !selectedFile) || isSending) return;

    setIsSending(true);
    setError(null);

    // Snapshot the file before clearing state, since state updates are async.
    const fileToSend = selectedFile;
    setValue("");
    setSelectedFile(null);

    try {
      let conversation;
      try {
        conversation = await ensureConversation();
      } catch (err) {
        console.error("Couldn't start a new conversation:", err);
        setError("Couldn't start a new conversation. Please try again.");
        return;
      }

      conversation = await maybeRenameConversation(conversation, prompt);
      const conversationId = conversation._id;

      dispatch(
        addMessage({
          conversationId,
          role: "user",
          content: prompt,
          artifacts: [],
          images: [],
        })
      );

      // Files must be sent as multipart/form-data — a plain object gets
      // JSON-serialized and silently drops the File's binary contents,
      // so the backend never sees req.file.
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("conversationId", conversationId);
      formData.append("agent", selectedAgent.toLowerCase());
      if (fileToSend) {
        formData.append("file", fileToSend);
      }

      const response = await callAgent(formData);

      if (!response?.success) {
        console.error("AI response failed:", response);
        setError("The assistant couldn't respond. Please try again.");
        return;
      }

      const artifacts = Array.isArray(response.artifacts) ? response.artifacts : [];
      const images = Array.isArray(response.images) ? response.images : [];

      artifacts.forEach((artifact) => dispatch(addArtifact(artifact)));

      dispatch(
        addMessage({
          conversationId,
          role: "assistant",
          content: response.data ?? "",
          artifacts,
          images,
        })
      );
    } catch (err) {
      console.error("Error sending message:", err.response?.data || err.message);
      setError("Something went wrong sending your message.");
    } finally {
      setIsSending(false);
    }
  }, [value, selectedFile, isSending, selectedAgent, dispatch, ensureConversation, maybeRenameConversation]);

  const handleKeyDown = useCallback(
    (e) => {
      // Enter sends the message; Shift+Enter inserts a newline.
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-3 border-t border-white/10 bg-[#010208]">
      <div className="max-w-4xl mx-auto mb-2 flex gap-2 overflow-x-auto scrollbar-none">
        {AGENTS.map((agent) => (
          <AgentButton
            key={agent.id}
            agent={agent}
            isActive={selectedAgent === agent.id}
            onSelect={setSelectedAgent}
          />
        ))}
      </div>

      <div className="flex flex-col gap-1.5 max-w-4xl mx-auto bg-[#080b14] border border-white/10 rounded-2xl px-4 pt-3 pb-2.5">
        {selectedFile && <FileChip file={selectedFile} onRemove={clearSelectedFile} />}

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Anything ..."
          rows={2}
          disabled={isSending}
          aria-label="Message"
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-500 leading-relaxed scrollbar-none [&::-webkit-scrollbar]:hidden"
        />

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <input
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              hidden
              ref={fileRef}
              onChange={handleFileChange}
            />
            <button
              type="button"
              aria-label="Attach file"
              onClick={openFilePicker}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/10 transition"
            >
              <Paperclip size={18} />
            </button>

            <button
              type="button"
              aria-label="Voice input"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/10 transition"
            >
              <Mic size={18} />
            </button>
          </div>

          <button
            type="button"
            aria-label="Send message"
            onClick={handleSendMessage}
            disabled={!canSend}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 text-slate-400 hover:bg-white/15 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
