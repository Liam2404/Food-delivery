import { Router } from 'express';
import restaurantAuthMiddleware from '../middlewares/authMiddleware.js';
import upload from '../upload.js';
import {
    restaurantLogin,
    restaurantRegister,
    addMeal,
    getMealsByRestaurant,
    getAllRestaurants,
    deleteMeal,
    getMealsById,
    restaurantAll,
    restaurantDelete,
    restaurantInfo,
    restaurantUpdate,
    updateMeal,
    addScore,
    getAverageScore,
    updateScore
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

router.post("/add", addScore);
router.get('/average/:restaurantId', getAverageScore);
router.put('/update/:scoreId', updateScore);



export default router;
