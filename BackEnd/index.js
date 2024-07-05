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

// Middleware pour configurer CORS
app.use(cors({
    origin: '*',
    credentials: true, // Autoriser les cookies avec CORS
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "*"
}));

// Middleware pour parser les cookies
app.use(cookieParser());

// Middleware pour gérer les sessions
app.use(session({
    secret: 'secret', // Changez ceci pour un secret plus sécurisé
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Modifiez pour 'secure: true' en production avec HTTPS
}));

// Configuration de la connexion à la base de données avec pool de connexions
export const db = mysql.createPool({
    connectionLimit: 10, // Limite de connexions simultanées
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
