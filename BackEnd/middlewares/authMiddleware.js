// Middleware pour vérifier si l'utilisateur est connecté
const authMiddleware = (req, res, next) => {
    if (req.session.user) {
        // Si l'utilisateur est connecté, passez à l'étape suivante
        next();
    } else {
        // Si l'utilisateur n'est pas connecté, renvoyez une erreur 401 (non autorisé)
        res.status(401).send('Utilisateur non connecté');
    }
};

export default authMiddleware;