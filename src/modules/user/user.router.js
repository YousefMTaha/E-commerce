import { Router } from "express";
import * as userController from "./controller/user.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth } from "../../middleware/auth.js";
import { IdValidator, validation } from "../../middleware/validation.js";
import userEndPoint from "./user.endPoint.js";
const router = Router();

router.get(
  "/addToFavorite/:id",
  auth(userEndPoint.favoriteOperation),
  validation(IdValidator),
  asyncHandler(userController.addToFavorite)
);

router.get(
  "/getFavorite",
  auth(userEndPoint.favoriteOperation),
  asyncHandler(userController.getFavorites)
);

router.delete(
  "/deleteFromFavorites/:id",
  auth(userEndPoint.favoriteOperation),
  validation(IdValidator),
  asyncHandler(userController.removeFromFavorite)
);
export default router;
