import crypto from "crypto";
import { adminAuth } from "../config/firebase.config.js";
import Auth from "../model/auth.model.js";
import redis from "../../../shared/redis/redis.js";

export const createUser = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
        success: false,
      });
    }

    // Verify Firebase ID Token
    const decodedToken = await adminAuth.verifyIdToken(token);

    const {
      uid,
      email,
      picture: photoURL,
      name,
    } = decodedToken;

    if (!uid || !email || !name) {
      return res.status(400).json({
        message: "Invalid Firebase Token",
        success: false,
      });
    }

    // Find user in MongoDB
    let user = await Auth.findOne({ uid });

    // Create user if not exists
    if (!user) {
      user = await Auth.create({
        uid,
        name,
        email,
        photoURL,
      });
    }

    // Check existing session
    const existingSessionID = req.cookies?.session;

    if (existingSessionID) {
      const existingSession = await redis.get(
        `session-${existingSessionID}`
      );

      if (existingSession) {
        console.log("Existing session found");

        return res.status(200).json({
          message: "User already logged in",
          success: true,
          data: user,
        });
      }
    }

    // Create new session only when required
    const sessionID = crypto.randomUUID();

    const sessionData = {
      userid: user._id,
      name: user.name,
      email: user.email,
      avatar: user.photoURL,
    };

    await redis.set(
      `session-${sessionID}`,
      JSON.stringify(sessionData),
      "EX",
      7 * 24 * 60 * 60
    );

    console.log("New session created:", sessionID);

    res.cookie("session", sessionID, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User login successful",
      success: true,
      data: user,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const sessionID = req.cookies?.session;

    if (sessionID) {
      await redis.del(`session-${sessionID}`);
    }

    res.clearCookie("session");

    return res.status(200).json({
      message: "Logout successfully",
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const allUser = await Auth.find();

    return res.status(200).json({
      message: "All users fetched successfully",
      data: allUser,
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};