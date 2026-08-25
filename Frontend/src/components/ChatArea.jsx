import MessageList from "./MessageList";
import Navbar from "./Navbar";
import ChatInput from "./ChatInput";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getMessage } from "../features/CHATAPI/conversation.api";
import { addArtifact, setMessage } from "../store/MessageSlice";

const ChatArea = () => {
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedConversation?._id) return;

    const fetchMessages = async () => {
      try {
        const response = await getMessage(selectedConversation._id);

        const messages = response.data || [];

        // Get all artifacts from all messages
        const artifacts = messages.flatMap(
          (message) => message.artifacts || []
        );

        // Get the latest message that contains artifacts
        const latestArtifactMessage = [...messages]
          .reverse()
          .find(
            (message) =>
              Array.isArray(message.artifacts) &&
              message.artifacts.length > 0
          );

        console.log("Messages:", messages);
        console.log("Artifacts:", artifacts);
        console.log("Latest Artifact Message:", latestArtifactMessage);

        // Store messages in Redux
        dispatch(setMessage(messages));

        // Store artifacts in Redux
        if (artifacts.length > 0) {
          dispatch(addArtifact(artifacts));
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [selectedConversation?._id, dispatch]);

  return (
    <div className="flex flex-1 flex-col bg-[#03040a]">
      <Navbar />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatArea;