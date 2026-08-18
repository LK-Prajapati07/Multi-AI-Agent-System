import { Mic, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import callAgent from "../features/agent";
import {
  createConversation,
  updateConversationTitle,
} from "../features/CHATAPI/conversation.api";

import { addMessage } from "../store/MessageSlice";
import { setSelectedConversations } from "../store/conversation";

const ChatInput = () => {
  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const dispatch = useDispatch();
  const [value, setValue] = useState("");

  const handleSendMessage = async () => {
    const prompt = value.trim();

    if (!prompt) return;

    try {
      let conversation = selectedConversation;

      // Create conversation if none is selected
      if (!conversation?._id) {
        const response = await createConversation();

        conversation = response.data;

        if (!conversation?._id) {
          console.error("Conversation creation failed:", response);
          return;
        }

        dispatch(setSelectedConversations(conversation));
      }

      const conversationId = conversation._id;

      // Update title only for new conversation
      if (conversation.title === "new Chat") {
        try {
          const response = await updateConversationTitle({
            id: conversationId,
            title: prompt,
          });

          // Don't deselect conversation if update fails
          if (response?.data) {
            conversation = response.data;

            dispatch(setSelectedConversations(conversation));
          }
        } catch (error) {
          console.error(
            "Title update failed:",
            error.response?.data || error.message
          );
        }
      }

      // Add user message immediately
      dispatch(
        addMessage({
          conversationId,
          role: "user",
          content: prompt,
        })
      );

      // Clear input
      setValue("");

      // Call AI agent
      const response = await callAgent({
        prompt,
        conversationId,
      });

      console.log("AI response:", response);

      if (!response?.success) {
        console.error("AI response failed:", response);
        return;
      }

      // Add AI response
      dispatch(
        addMessage({
          conversationId,
          role: "assistant",
          content: response.data,
        })
      );
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-3 border-t border-white/10 bg-[#010208]">
      <div className="flex flex-col gap-1.5 max-w-4xl mx-auto bg-[#080b14] border border-white/10 rounded-2xl px-4 pt-3 pb-2.5">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask Anything ..."
          rows={2}
          className="
            w-full
            bg-transparent
            outline-none
            resize-none
            text-[14px]
            text-slate-200
            placeholder:text-slate-500
            leading-relaxed
            scrollbar-none
            [&::-webkit-scrollbar]:hidden
          "
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="
                flex items-center justify-center
                w-8 h-8
                rounded-lg
                text-slate-500
                hover:text-slate-200
                hover:bg-white/10
                transition
              "
            >
              <Paperclip size={18} />
            </button>

            <button
              type="button"
              className="
                flex items-center justify-center
                w-8 h-8
                rounded-lg
                text-slate-500
                hover:text-slate-200
                hover:bg-white/10
                transition
              "
            >
              <Mic size={18} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!value.trim()}
            className="
              flex items-center justify-center
              w-9 h-9
              rounded-xl
              bg-white/10
              text-slate-400
              hover:bg-white/15
              hover:text-white
              transition
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;