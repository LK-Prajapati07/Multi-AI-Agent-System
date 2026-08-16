import Conversation from "../model/converstion.model.js";
import Message from "../model/message.model.js";

export const createConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const newConversation = await Conversation.create({
            userId
        });

        return res.status(201).json({
            success: true,
            message: "Conversation created successfully",
            data: newConversation
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getConversations = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const conversations = await Conversation.find({
            userId
        }).sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Conversations fetched successfully",
            data: conversations
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const updateConversation = async (req, res) => {
    try {
        const {id,title} = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const conversations = await Conversation.findByIdAndUpdate(
            userId,
            {title}
        ).sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Conversations update successfully",
            data: conversations
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const saveMessage = async (req, res) => {
    try {
        const { conversationId, role, content } = req.body;

        const newMessage = await Message.create({
            conversationId,
            role,
            content
        });

        return res.status(201).json({
            success: true,
            message: "Message saved successfully",
            data: newMessage
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getMessage = async (req, res) => {
  try {
    const { conversationId } = req.query;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    const messages = await Message.find({
      conversationId,
    })

    return res.status(200).json({
      success: true,
      data: messages,
      message: "Messages fetched successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};