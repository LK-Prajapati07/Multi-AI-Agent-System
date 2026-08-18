import MessageList from "./MessageList";
import Navbar from "./Navbar";
import ChatInput from "./ChatInput";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getMessage } from "../features/CHATAPI/conversation.api";
import { setMessage } from "../store/MessageSlice";

const ChatArea = () => {
  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation?._id) {
        return;
      }

      try {
        const response = await getMessage(
          selectedConversation._id
        );

        console.log("Messages from API:", response.data);

        dispatch(setMessage(response.data));
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [selectedConversation?._id, dispatch]);

  return (

    <div className="flex-1 flex flex-col bg-[#03040a] ">
      
      <Navbar />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatArea;