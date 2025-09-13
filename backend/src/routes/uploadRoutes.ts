import path from "path";
import express from "express";
import multer from "multer";
import fs from "fs";
import type { Request } from "express";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const filetypes = /jpe?g|png|webp|avif/;
  const mimetypes = /image\/jpe?g|image\/png|avif|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images only!"));
  }
}

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    // Copy file to frontend public directory
    const __dirname = path.resolve();
    const frontendUploadsPath = path.join(__dirname, "frontend", "public", "uploads");
    
    // Ensure frontend uploads directory exists
    if (!fs.existsSync(frontendUploadsPath)) {
      fs.mkdirSync(frontendUploadsPath, { recursive: true });
    }
    
    const sourcePath = req.file.path;
    const fileName = path.basename(req.file.filename);
    const destinationPath = path.join(frontendUploadsPath, fileName);
    
    try {
      // Copy file to frontend public directory
      fs.copyFileSync(sourcePath, destinationPath);
    } catch (copyError) {
      console.error("Error copying file to frontend:", copyError);
      // Don't fail the upload if copy fails, just log the error
    }

    res.status(200).send({
      message: "Image uploaded successfully",
      image: `/uploads/${fileName}`,
    });
  });
});

export default router;
