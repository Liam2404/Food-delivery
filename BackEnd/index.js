import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import mysql from 'mysql';
import userRouter from './Router/user.js';
import stripeRouter from './Router/stripe.js';
import restauRouter from './Router/restau.js';

const app = express();
const port = 3000;

// Liste des origines autorisées
const allowedOrigins = ['http://localhost:5173'];

// Middleware pour configurer CORS
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            // Autorise les requêtes venant de l'origine spécifiée ou les requêtes sans origine (par exemple, depuis Postman)
            callback(null, true);
        } else {
            callback(new Error('CORS non autorisé par origine'));
        }
    },
    credentials: true, // Autoriser les cookies avec CORS
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization, JSON" // Ajoutez les en-têtes autorisés
}));

// Middleware pour parser les cookies
app.use(cookieParser());

// Middleware pour gérer les sessions
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Modifiez en `true` en production avec HTTPS
        httpOnly: true, // Empêche l'accès via JavaScript
        maxAge: 24 * 60 * 60 * 1000, // Durée de vie du cookie 24h
        sameSite: 'lax',
    },
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

// Routes pour Stripe Webhook
app.use('/webhook', stripeRouter);

// Middleware pour parser les corps de requête JSON
app.use(express.json());

// Routes pour les utilisateurs
app.use('/api/user', userRouter);

// Routes pour les restaurants
app.use('/api/restaurant', restauRouter);



// Écoute du serveur sur le port spécifié
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});

export default db;
