import { PutObjectCommand } from "@aws-sdk/client-s3";
import client from "../config/s3.config.js";

export const upload = async (filename, buffer, contentType) => {
  try {
    const result = await client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
      })
    );

    console.log("File uploaded successfully", result);

    return result;
  } catch (error) {
    console.log("Error occurred in backend:", error);
    throw error;
  }
};
 