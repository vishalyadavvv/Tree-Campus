import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Allowed formats
const allowedFormats = ["jpg", "jpeg", "png", "webp", "gif", "pdf"];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "treecampus/uploads"; // your Cloudinary folder

    return {
      folder,
      allowed_formats: allowedFormats,
      resource_type: file.mimetype === "application/pdf" ? "raw" : "image",
      public_id: `file-${Date.now()}`,
    };
  },
});

// Multer Upload Instance
export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

export default upload;
