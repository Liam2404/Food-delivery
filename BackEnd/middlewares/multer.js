// middlewares/multer.js
import multer from 'multer';
import path from 'path';

// Configuration du stockage avec Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');  // Dossier où les fichiers sont enregistrés
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));  // Nom de fichier unique
  }
});

// Filtrage des fichiers pour accepter uniquement les images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // Accepter le fichier
  } else {
    cb(new Error('Type de fichier non supporté'), false);  // Refuser le fichier
  }
};

// Configuration multer avec taille limite et filtrage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5  // Limite de taille 5 MB
  },
  fileFilter: fileFilter
});

export default upload;
