import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadFile = async (data) => {
  const file = data; // Accessing file object
  console.log("Received file for upload:", file);

  try {
    // Cloudinary upload stream setup
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: "auto" }, // Automatically detect file type
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error); // More detailed logging
            reject(error);
          } else {
            console.log("Cloudinary upload result:", result); // More detailed logging
            resolve(result);
          }
        }
      ).end(file.buffer); // Using file.buffer for direct file upload
    });

    console.log("Cloudinary upload result:", result);
    return result.secure_url; // Returning the secure URL of uploaded file

  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw error; // Throw error for further handling in controller
  }
};
