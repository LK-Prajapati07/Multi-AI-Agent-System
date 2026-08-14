import { motion } from "framer-motion";
import api from "../utils/axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase.utils";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/createSlice";

import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";

const stars = Array.from({ length: 70 }, (_, i) => ({
  top: `${(i * 13.7) % 100}%`,
  left: `${(i * 17.3) % 100}%`,
  duration: (i % 4) + 2,
}));

const Home = () => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();



  // Login API
  const loginHandle = async (token) => {
    try {
      const res = await api.post("/api/auth/login", {
        token,
      });

      console.log("Login response:", res.data);

   
      dispatch(setUser(res.data.data));
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data || error.message
      );
    }
  };

  // Google Login
  const googleLogin = async () => {
    try {
      const data = await signInWithPopup(
        auth,
        googleProvider
      );

      const token = await data.user.getIdToken();

      console.log("Firebase token:", token);

      await loginHandle(token);
    } catch (error) {
      console.error(
        "Google login failed:",
        error.message
      );
    }
  };

  return (
    <>
      {!user ? (
        /* ================= LOGIN ================= */
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030507]">

          {/* Background */}
          <div className="absolute inset-0 bg-linear-to-br from-[#020304] via-[#05070A] to-[#0A0E14]" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(
                  rgba(255,255,255,.15) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(255,255,255,.15) 1px,
                  transparent 1px
                )
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Stars */}
          <div className="absolute inset-0">
            {stars.map((star, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: star.top,
                  left: star.left,
                  width: `${(i % 3) + 1}px`,
                  height: `${(i % 3) + 1}px`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>

          {/* Aurora */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
            className="absolute left-1/2 top-1/2 h-162.5 w-162.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[180px]"
          />

          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
            className="absolute left-1/3 top-1/3 h-125 w-125 rounded-full bg-cyan-500/10 blur-[170px]"
          />

          {/* Login Card */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="relative z-20"
          >
            <div className="w-107.5 rounded-3xl border border-white/10 bg-white/4 p-10 shadow-2xl backdrop-blur-3xl">

              {/* Badge */}
              <div className="mx-auto mb-8 w-fit rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1 text-xs font-medium text-cyan-300">
                ✨ Powered by AI
              </div>

              {/* Logo */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-cyan-500 to-violet-600 text-3xl font-bold text-white shadow-lg">
                A
              </div>

              {/* Heading */}
              <h1 className="text-center text-4xl font-bold tracking-tight text-white">
                Agenis AI
              </h1>

              <p className="mt-4 text-center leading-7 text-zinc-400">
                Build, chat, automate and learn with an intelligent AI
                workspace designed for developers and students.
              </p>

              {/* Google Login */}
              <motion.button
                whileHover={{
                  scale: 1.02,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={googleLogin}
                className="group mt-10 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 font-medium text-white transition-all hover:bg-white/10"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.6 20H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4C12.9 4 4 12.9 4 24s8.9 20 20 20s20-8.9 20-20c0-1.3-.1-2.7-.4-4z"
                  />

                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4C16.3 4 9.7 8.3 6.3 14.7z"
                  />

                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
                  />

                  <path
                    fill="#1976D2"
                    d="M43.6 20H42V20H24v8h11.3c-1.1 3.2-3.4 5.7-6.5 7.3l6.2 5.2C39.8 37.2 44 31.2 44 24c0-1.3-.1-2.7-.4-4z"
                  />
                </svg>

                Continue with Google
              </motion.button>

              <p className="mt-8 text-center text-xs text-zinc-500">
                Secure authentication powered by Google Firebase.
              </p>
            </div>
          </motion.div>
        </div>
      ) : (
        /* ================= APPLICATION ================= */
        <div className="flex h-screen w-full overflow-hidden">
          <Sidebar />

          <div className="flex min-w-0 flex-1">
            <ChatArea />
          </div>

          <Artifact />
        </div>
      )}
    </>
  );
};

export default Home;