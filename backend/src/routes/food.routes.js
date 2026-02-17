import express from "express"
import { authFoodPartnerMiddleware ,authUserMiddleware } from "../middleware/auth.middleware.js";
import multer from "multer";
import { createFood, getFoodItems , getFoodPartnerNdVideoById
  ,likeFoodItem , SaveFoodItem ,fetchSaveReels
 } from "../controllers/food.controller.js";

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


router.put("/like/:foodId",
  authUserMiddleware,
  likeFoodItem
  )


router.put("/save/:foodId",
  authUserMiddleware,
  SaveFoodItem
  )

router.get("/saved-reels",
  authUserMiddleware,
  fetchSaveReels
)


export default router;
