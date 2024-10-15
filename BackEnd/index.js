import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import mysql from 'mysql';
import userRouter from './Router/user.js';
import stripeRouter from './Router/stripe.js';
import restauRouter from './Router/restau.js';
import upload from './middlewares/multer.js';  

// Initialisation d'Express
const app = express();

// Liste des origines autorisées
const allowedOrigins = ['http://localhost:5173'];

// Middleware pour configurer CORS
app.use(cors({
    origin: (origin, callback) => {
        console.log('Origine de la requête:', origin);
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS non autorisé par origine'));
        }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization, JSON"
}));

// Middleware pour parser les cookies
app.use(cookieParser());

// Middleware pour gérer les sessions
app.use(session({
    secret: 'votre-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Assurez-vous que les cookies ne sont pas accessibles depuis le client
      secure: false,  // Utilisez 'true' en production si vous êtes en HTTPS
      sameSite: 'lax', // Permet de partager les cookies entre le backend et le frontend
      maxAge: 24 * 60 * 60 * 1000 // Durée de vie du cookie : 1 jour
    }
  }));
  

// Configuration de la connexion à la base de données avec pool de connexions
export const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    port: '3306',
    database: 'food'
});

// Middleware pour rendre la pool de connexions disponible dans les routes
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Middleware pour parser les corps de requête JSON
app.use(express.json());

// Rendre le dossier 'uploads' accessible
app.use('/uploads', express.static('uploads'));

// Routes pour Stripe Webhook
app.use('/webhook', stripeRouter);

// Routes pour les utilisateurs
app.use('/api/user', userRouter);

// Routes pour les restaurants
app.use('/api/restaurant', restauRouter);


// Route pour télécharger et enregistrer l'image
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier téléchargé.' });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const restaurantId = req.body.restaurantId; // ID du restaurant à mettre à jour

    if (!restaurantId) {
        return res.status(400).json({ error: 'ID du restaurant requis.' });
    }

    // Enregistrez l'URL de l'image dans la base de données
    const query = 'UPDATE restaurant SET restaurant_img = ? WHERE id = ?';
    req.db.query(query, [imagePath, restaurantId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la mise à jour de la base de données.' });
        }
        res.json({ filePath: imagePath });
    });
});


// Définir le port
const port = 3000;

// Écoute du serveur sur le port spécifié
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});

export default db;
