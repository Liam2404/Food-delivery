import { Router } from 'express';
import restaurantAuthMiddleware from '../middlewares/authMiddleware.js';
import upload from '../upload.js';
import {
    restaurantLogin,
    restaurantAll,
    restaurantDelete,
    restaurantInfo,
    restaurantRegister,
    restaurantUpdate,
    addMeal,
    updateMeal,
    getAllRestaurants,
    deleteMeal,
    getMealsByRestaurant,
    getMealsById,
    addRating,
    getAverageRating,
    updateRating
} from "../Controller/restau.js";

const router = Router();

router.post("/login", restaurantLogin);
router.post('/register', upload.single('image'), restaurantRegister);
router.get("/all", getAllRestaurants);
router.get("/info/:id", restaurantInfo);
router.get("/", restaurantAll);
router.delete("/:id", restaurantDelete);
router.put("/:id", restaurantUpdate);

router.post("/meal", restaurantAuthMiddleware, upload.single('meal_img'), addMeal);
router.put("/meal/:id", restaurantAuthMiddleware, upload.single('meal_img'), updateMeal);
router.delete("/meal/:id", restaurantAuthMiddleware, deleteMeal);
router.get("/meals/restaurant/:restaurantId", getMealsByRestaurant);
router.get("/meals/:id", getMealsById);

router.post("/add", addRating);
router.get('/average/:restaurantId', getAverageRating);
router.put('/update/:ratingId', updateRating);



export default router;
