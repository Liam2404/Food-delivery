// Middleware pour vérifier si le restaurant est connecté
const restaurantAuthMiddleware = (req, res, next) => {
    if (req.session.restaurant) {
        next(); // Si le restaurant est connecté, on continue
    } else {
        res.status(401).send('Restaurant non connecté');
    }
};

const userAuthMiddleware = (req, res, next) => {
    if (req.session.user) {
        next(); // Si le client est connecté, on continue
    } else {
        res.status(401).send('Utilisateur non connecté');
    }
};

export default (restaurantAuthMiddleware, userAuthMiddleware);
