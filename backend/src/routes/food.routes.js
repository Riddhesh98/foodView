import express from "express"
import { authFoodPartnerMiddleware ,authUserMiddleware } from "../middleware/auth.middleware.js";
import multer from "multer";
import { createFood, getFoodItems , getFoodPartnerNdVideoById } from "../controllers/food.controller.js";

//file upload as buffer

const upload = multer({
    storage: multer.memoryStorage(),
  });
const router = express.Router();
// /api/food

router.post("/",
    authFoodPartnerMiddleware,
    upload.single("video"),
     createFood)

router.get("/", getFoodItems)



router.get("/foodpartner/:id",
  authUserMiddleware,
  getFoodPartnerNdVideoById
  )


export default router;
