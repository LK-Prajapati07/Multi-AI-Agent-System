import {useSelector} from "react-redux"
import { MessageSquare } from 'lucide-react'
const Navbar = () => {
  const {data}=useSelector((state=>state.conversation))
  console.log(data)
  return (
    <div className="h-14 flex items-center justify-center px-5 border-b border-white/6 bg-black gap-2.5">
      <div className="px-5">
    <MessageSquare
     size={30} className="text-white"/>
      </div>
      <div>
        {data?.title || "New Chat"}
      </div>
    </div>
  )
}

export default Navbar