import { useSelector } from "react-redux";
import { MessageSquare } from "lucide-react";

const Navbar = () => {
  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const { Message } = useSelector(
    (state) => state.message
  );

  console.log(selectedConversation);

  return (
    selectedConversation && (
      <div className="h-14 flex items-center px-5 border-b border-white/6 bg-black gap-2.5">
        <div className="px-5">
          <MessageSquare
            size={30}
            className="text-white"
          />
        </div>

        <div className="text-white font-semibold tracking-wide text-lg">
          {selectedConversation.title}
        </div>

        <div className="text-[10px] font-medium text-slate-600 bg-white border border-white px-1 py-0.5 rounded-full">
          {Message?.length || 0} Messages
        </div>
      </div>
    )
  );
};

export default Navbar;