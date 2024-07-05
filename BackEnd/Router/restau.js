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
router.get("/info/:id", restaurantInfo);
router.post("/register", restaurantRegister);
router.route("/:id")
    .get(restaurantAll)
    .delete(restaurantDelete)
    .put(restaurantUpdate);

router.post("/meal", addMeal);
router.put("/meal/:id", updateMeal);
router.delete("/meal/:id", deleteMeal);
router.get("/meals/:id", getMealsById);
router.get("/meals/:restaurantId", getMealsByRestaurant);

export default router;
