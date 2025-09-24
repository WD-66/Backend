import type { RequestHandler } from 'express';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const cloudUploader: RequestHandler = async (req, res, next) => {
  try {
    const filePath = req.image!.filepath;

    const cloudinaryData = await cloudinary.uploader.upload(filePath);

    // console.log(cloudinaryData);

    req.body.image = cloudinaryData.secure_url;
    next();
  } catch (error) {
    next(error);
  }
};

export default cloudUploader;
