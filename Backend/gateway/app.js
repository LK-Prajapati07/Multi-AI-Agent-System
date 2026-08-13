import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
import { proxywithHeader } from "./middleware/proxyHeader.js";
import { protect } from "../shared/protect.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());



app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});

app.use("/api/auth", proxy(process.env.AUTH));
app.use("/api/chat", protect,proxywithHeader(process.env.CHAT));
app.use("/api/agent",proxy(process.env.AGENT))

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});