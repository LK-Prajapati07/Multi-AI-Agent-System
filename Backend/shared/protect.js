import redis from "./redis/redis.js";

export const protect = async (req, res, next) => {
  try {
    const sessionID = req.cookies?.session;

    if (!sessionID) {
      return res.status(400).json({
        message: "Please login First",
      });
    }

    const session = await redis.get(`session-${sessionID}`);

    if (!session) {
      return res.status(400).json({
        message: "session expired",
      });
    }

    req.user = JSON.parse(session);

    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};