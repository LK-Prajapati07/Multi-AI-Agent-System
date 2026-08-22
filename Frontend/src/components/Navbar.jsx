import { useSelector } from "react-redux";
import { MessageSquare } from "lucide-react";

const Navbar = () => {
  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const { Message } = useSelector((state) => state.message);
  // console.log(Message)

  if (!selectedConversation) return null;

  return (
    <header className="w-full h-14 sm:h-16 flex items-center gap-3 px-3 sm:px-5 border-b border-white/10 bg-black">
      
    
      <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 shrink-0">
        <MessageSquare
          size={20}
          className="text-white sm:w-5.5 sm:h-5.5"
        />
      </div>

     
      <div className="min-w-0 flex-1 flex items-center gap-2 sm:gap-3">
        
      
        <h1 className="text-sm sm:text-base md:text-lg font-semibold text-white tracking-wide truncate">
          {selectedConversation.title}
        </h1>

        <span className="shrink-0 text-[9px] sm:text-[10px] font-medium text-slate-300 bg-white/5 border border-white/10 px-2 py-1 rounded-full whitespace-nowrap">
          {Message?.length || 0}{" "}
          <span className="hidden xs:inline">Messages</span>
          <span className="xs:hidden">Msg</span>
        </span>
      </div>
    </header>
  );
};

export default Navbar;