import MessageList from "./MessageList"
import Navbar from "./Navbar"
import ChatInput from "./ChatInput"

const ChatArea = () => {
  return (
    <div className="flex-1 flex flex-col ">
      <Navbar />
      <MessageList/>
      <ChatInput/>
    </div>
  )
}

export default ChatArea