import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import userRouter from './Router/user.js';
import stripeRouter from './Router/stripe.js';


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
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

// Configuration de la connexion à la base de données
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'food'
});

// Connexion à la base de données
connection.connect(err => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données :', err);
    } else {
        console.log('Connexion établie avec la base de données');
    }
});

app.use('/webhook', stripeRouter);

app.use(bodyParser.json());
app.use('/api/user', userRouter);

// Écoute du serveur sur le port spécifié
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});

export default connection
