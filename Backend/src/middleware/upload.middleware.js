import multer from "multer";
import path from "path";

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/properties");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp/;

  const isValidExtension = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const isValidMimeType = allowedTypes.test(file.mimetype);

  if (isValidExtension && isValidMimeType) {
    return cb(null, true);
  }

  cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
};

// Upload Middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export default upload;