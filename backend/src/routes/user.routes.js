import express from "express";
import { Router } from "express";
import { registerUser , loginUser,logoutUser,
    registerFoodPartner , loginFoodPartner , logoutFoodPartner
} from "../controllers/user.controller.js";


const router = Router();
// User routes
router.post("/users/register",registerUser )
router.post("/users/login", loginUser)
router.post("/users/logout", logoutUser) 

// Food Partner routes
router.post("/food-partner/register", registerFoodPartner)
router.post("/food-partner/login", loginFoodPartner)
router.post("/food-partner/logout", logoutFoodPartner)

export default router;