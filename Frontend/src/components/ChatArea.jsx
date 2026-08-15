import MessageList from "./MessageList"
import Navbar from "./Navbar"
import ChatInput from "./ChatInput"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { getConversations } from "../features/CHATAPI/conversation.api"
import { setMessage } from "../store/MessageSlice"

const ChatArea = () => {
  const {selectedConversation}=useSelector(state=>state.conversation)
  const dispatch=useDispatch()
  console.log(selectedConversation)
  useEffect(()=>{
    const getMesg=async()=>{
      if(selectedConversation){
      const data=  await getConversations(selectedConversation)
      dispatch(setMessage(data))
      }
    }
    getMesg()
  },[selectedConversation,dispatch])
  return (
    <div className="flex-1 flex flex-col ">
      <Navbar />
      <MessageList/>
      <ChatInput/>
    </div>
  )
}

export default ChatArea