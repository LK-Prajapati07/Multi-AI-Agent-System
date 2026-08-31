import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const artifactSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      default: "",
    },

    url: {
      type: String,
      default: "",
    },

    filename: {
      type: String,
      default: "",
    },

    prompt: {
      type: String,
      default: "",
    },

    expiresIn: {
      type: Number,
      default: 0,
    },

    files: {
      type: [fileSchema],
      default: [],
    },
  },
  {
    _id: false,
  }
);

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    artifacts: {
      type: [artifactSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;