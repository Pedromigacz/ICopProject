if (process.env.NODE_ENV !== "production") require("dotenv").config();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "Tradojo",
      allowedFormats: ["png", "pdf", "jpg"], // supports promises as well
      public_id: `${file.originalname}${Date.now()}`,
      flags: "attachment",
    };
  },
});

module.exports = multer({ storage });
