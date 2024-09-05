import { Router } from 'express';
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
    getMealsById
} from "../Controller/restau.js";

const router = Router();

router.post("/login", restaurantLogin);
router.post('/register', upload.single('image'), restaurantRegister);
router.get("/all", getAllRestaurants);
router.get("/info/:id", restaurantInfo);
router.get("/", restaurantAll);
router.delete("/:id", restaurantDelete);
router.put("/:id", restaurantUpdate);

router.post("/meal", upload.single('meal_img'), addMeal);
router.put("/meal/:id", upload.single('meal_img'), updateMeal);
router.delete("/meal/:id", deleteMeal);
router.get("/meals/restaurant/:restaurantId", getMealsByRestaurant);
router.get("/meals/:id", getMealsById);

export default router;
