import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import client from "../config/s3.config.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const getFormS3 = async (filename, expireIn = 600) => {
  try {
    return await getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: filename,
      }),
      {
        expiresIn: expireIn,
      }
    );
  } catch (error) {
    console.log("Error occurred:", error);
    throw error;
  }
};