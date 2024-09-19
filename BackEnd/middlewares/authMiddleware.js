// Middleware pour vérifier si le restaurant est connecté
const restaurantAuthMiddleware = (req, res, next) => {
    if (req.session.restaurant) {
        next(); // Si le restaurant est connecté, on continue
    } else {
        res.status(401).send('Restaurant non connecté');
    }
};

export default restaurantAuthMiddleware;
