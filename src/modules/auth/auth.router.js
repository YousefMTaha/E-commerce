import { Router } from "express";
const router = Router();
import * as authController from "./controller/registration.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validator from "./auth.validation.js";

router.get("/", (req, res) => {
  res.status(200).json({ message: "User Module" });
});

router.post(
  "/signup",
  fileUpload(fileValidation.image).single("image"),
  validation(validator.add),
  asyncHandler(authController.add)
);
router.put(
  "/confirm-email",
  validation(validator.confirmEmail),
  authController.confirmEmail
);
router.post(
  "/login",
  validation(validator.login),
  asyncHandler(authController.login)
);

router.get(
  "/forgetPasswordMail",
  validation(validator.forgetPasswordMail),
  asyncHandler(authController.forgetPasswordMail)
);

router.get(
  "/forgetPassword",
  validation(validator.forgetPassword),
  asyncHandler(authController.forgetPassword)
);

export default router;
