import axios from "axios";

export const getMessage = async (conversationId) => {
  try {
    const { data } = await axios.get(
      `${process.env.CHAT_SERVICE}/message`,
      {
        params: {
          conversationId,
        },
      }
    );

    return data.data;

  } catch (err) {
    console.error(
      "getMessage error:",
      err.response?.data || err.message
    );

    throw err;
  }
};