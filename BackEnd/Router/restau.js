import { Router } from 'express';
import {
    restaurantLogin,
    restaurantAll,
    restaurantDelete,
    restaurantInfo,
    restaurantRegister,
    restaurantUpdate,
    addMeal,
    updateMeal,
    deleteMeal,
    getMealsByRestaurant,
    getMealsById
} from "../Controller/restau.js";

const router = Router();

router.post("/login", restaurantLogin);
router.post("/register", restaurantRegister);
router.get("/info/:id", restaurantInfo);
router.get("/", restaurantAll);
router.delete("/:id", restaurantDelete);
router.put("/:id", restaurantUpdate);

router.post("/meal", addMeal);
router.put("/meal/:id", updateMeal);
router.delete("/meal/:id", deleteMeal);
router.get("/meals/restaurant/:restaurantId", getMealsByRestaurant);
router.get("/meals/:id", getMealsById);

export default router;
