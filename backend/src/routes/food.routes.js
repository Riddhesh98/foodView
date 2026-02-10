import express from "express"
import { authFoodPartnerMiddleware } from "../middleware/auth.middleware.js";
import multer from "multer";
import { createFood } from "../controllers/food.controller.js";

//file upload as buffer

const upload = multer({
    storage: multer.memoryStorage(),
  });
const router = express.Router();
// /api/food

router.post("/create",
    authFoodPartnerMiddleware,
    upload.single("video"),
     createFood)



export default router;
