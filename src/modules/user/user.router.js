import { Router } from "express";
import * as userController from "./controller/user.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth, roles } from "../../middleware/auth.js";
import { IdValidator, validation } from "../../middleware/validation.js";
const router = Router();

router.get(
  "/addToFavorite/:id",
  auth([roles.User]),
  validation(IdValidator),
  asyncHandler(userController.addToFavorite)
);

router.get(
  "/getFavorite",
  auth([roles.User]),
  asyncHandler(userController.getFavorites)
);

router.delete(
  "/deleteFromFavorites/:id",
  auth([roles.User]),
  validation(IdValidator),
  asyncHandler(userController.removeFromFavorite)
);
export default router;
