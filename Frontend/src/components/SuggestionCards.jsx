import { motion } from "framer-motion";

const suggestions = [
  {
    title: "Write a Netflix clone",
    icon: "🚀",
  },
  {
    title: "Explain Redis",
    icon: "⚡",
  },
  {
    title: "Build a Dashboard",
    icon: "📊",
  },
];

const SuggestionCards = () => {
  return (
    <motion.div
      className="
        mt-8
        flex
        flex-wrap
        justify-center
        gap-3
      "
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 1,
        duration: 0.7,
      }}
    >

      {suggestions.map((item) => (
        <motion.button
          key={item.title}
          className="
            flex
            items-center
            gap-3
            px-5
            py-3
            rounded-xl
            border
            border-white/10
            bg-white/4
            backdrop-blur-xl
            text-slate-300
            shadow-lg
          "
          whileHover={{
            scale: 1.04,
            y: -5,
            borderColor: "rgba(168,85,247,0.5)",
            backgroundColor: "rgba(255,255,255,0.08)",
            boxShadow:
              "0 15px 40px rgba(124,58,237,0.15)",
          }}
          whileTap={{
            scale: 0.96,
          }}
        >

          <span className="text-xl">
            {item.icon}
          </span>

          <span>
            {item.title}
          </span>

          <motion.span
            className="text-purple-400"
            whileHover={{
              x: 5,
            }}
          >
            →
          </motion.span>

        </motion.button>
      ))}

    </motion.div>
  );
};

export default SuggestionCards;