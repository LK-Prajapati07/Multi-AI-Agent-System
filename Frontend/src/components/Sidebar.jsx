
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MessageCircle,
  PanelLeftIcon,
  PenSquare,
  LogOut,
} from "lucide-react";
import gsap from "gsap";

import {
  createConversation,
  getConversations,
} from "../features/CHATAPI/conversation.api";

import {
  addConverastion,
  setConversation,
  setSelectedConversations,
} from "../store/conversation";

import Logout from "../features/UserAPI/user";
import { setUser } from "../store/createSlice";

const Sidebar = () => {
  
  const dispatch = useDispatch();

  const { conversation, selectedConversation } = useSelector(
    (state) => state.conversation
  );
  // console.log(conversation)

  const { user } = useSelector((state) => state.user);
  // console.log(user.data.avatar)
  const sidebarRef = useRef(null);
  const buttonRef = useRef(null);

  const [collapsed, setCollapsed] = useState(false);

  // =========================
  // Logout
  // =========================
  const handleLogout = async () => {
   
    try {
      const data = await Logout();

      console.log("Logout:", data);

      dispatch(setUser(null));
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleCreateConversation = async () => {
    try {
      const data = await createConversation();
     dispatch(addConverastion(data));
      dispatch(setSelectedConversations(data));
    } catch (error) {
      console.error("Create conversation failed:", error);
    }
  };


  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await getConversations();

        // console.log("Conversations:", data);

        dispatch(setConversation(data));
      } catch (error) {
        console.error("Get conversations failed:", error);
      }
    };

    fetchConversations();
  }, [dispatch]);

  // =========================
  // Sidebar Animation
  // =========================
  useEffect(() => {
    if (!sidebarRef.current) return;

    gsap.fromTo(
      sidebarRef.current,
      {
        x: -80,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      }
    );
  }, []);

  // =========================
  // Collapse Button Animation
  // =========================
  useEffect(() => {
    const button = buttonRef.current;

    if (!button) return;

    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.1,
        rotate: -5,
        duration: 0.2,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        rotate: 0,
        duration: 0.2,
      });
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (collapsed) {
    return (
      <aside className="flex h-screen w-16 flex-col items-center border-r border-gray-200 bg-white py-4 dark:border-gray-800 dark:bg-gray-950">
      
        <button
          onClick={() => setCollapsed(false)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <PanelLeftIcon size={20} />
        </button>

        {/* New Chat */}
        <button
          onClick={handleCreateConversation}
          className="mt-5 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-700 text-white transition-opacity hover:opacity-90"
        >
          <PenSquare size={19} />
        </button>
      </aside>
    );
  }

  // =========================
  // Full Sidebar
  // =========================
  return (
    <aside
      ref={sidebarRef}
      className="flex h-screen w-72 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
    >
      {/* =========================
          Header
      ========================= */}
      <div className="flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-700 text-sm font-bold text-white">
            A
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Multi AI AGENT
            </p>

            <p className="text-xs text-gray-400">
              Free
            </p>
          </div>
        </div>

        {/* Collapse */}
        <button
          ref={buttonRef}
          onClick={() => setCollapsed(true)}
          className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-gray-100 hover:text-slate-900 lg:flex dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <PanelLeftIcon size={18} />
        </button>
      </div>

      {/* =========================
          New Chat
      ========================= */}
      <div className="px-4 pb-2">
        <button
          onClick={handleCreateConversation}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-indigo-500 to-violet-700 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <PenSquare size={19} />
          New Chat
        </button>
      </div>

      {/* =========================
          Conversations
      ========================= */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {conversation?.length > 0 ? (
          conversation.map((conv, index) => {
            const isActive =
              selectedConversation?._id === conv._id;

            return (
              <div
                key={conv._id || index}
                onClick={() =>
                  dispatch(setSelectedConversations(conv))
                }
                className={`group mb-1 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {/* Icon */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isActive
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  <MessageCircle size={18} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {console.log(conv.title)}
                    {conv.title || "New Conversation"}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-gray-400">
                    {conv.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <MessageCircle
              size={30}
              className="mb-3 text-gray-400"
            />

            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              No conversations
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Start a new chat
            </p>
          </div>
        )}
      </div>

      {/* =========================
          User Profile
      ========================= */}
      {user && (
        <div className="border-t border-gray-200 p-3 dark:border-gray-800">
          <div className="flex items-center gap-3 rounded-xl p-2">
            {/* Avatar */}
            <img
              src={user.data.avatar}
              alt={user.data.name}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />

            {/* User Information */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                {user.data.name}
              </p>

              <p className="truncate text-xs text-gray-400">
                {user.data.email}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

