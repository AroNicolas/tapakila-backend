import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuration du stockage Multer avec Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const uniqueSuffix = uuidv4(); // Générer un identifiant unique
    return {
      folder: "event_images", // Dossier de stockage sur Cloudinary
      format: file.mimetype.split("/")[1], // Utiliser le format du fichier
      public_id: `${uniqueSuffix}`, // Nom du fichier unique
    };
  },
});

const upload = multer({ storage });

export default upload;
