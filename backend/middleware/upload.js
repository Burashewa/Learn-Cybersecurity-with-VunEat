const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "vulnerability_reports", 
    resource_type: "raw", 
    access_mode: "public",          
    upload_preset: "dmrraxia",
    type: "upload",   
    format: async (req, file) => "pdf", 
    public_id: (req, file) =>
      Date.now() + "-" + file.originalname.replace(/\.[^/.]+$/, ""),
  },
});

const upload = multer({ storage });

// after upload, explicitly set access_mode public
const makePublic = async (req, res, next) => {
  if (!req.file || !req.file.path) return next();
  
  try {
    // Re-explicitly set access mode for that file
    await cloudinary.api.update(req.file.filename, {
      access_mode: "public",
      resource_type: "raw",
    });
  } catch (error) {
    console.error("Failed to set access_mode public:", error);
  }
  
  next();
};

module.exports = { upload, makePublic };
