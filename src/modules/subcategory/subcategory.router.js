import { Router } from "express";
import * as subcategoryController from "./controller/subcategory.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as validator from "./subcategory.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth } from "../../middleware/auth.js";
import subcategoryEndpoint from "./subcategory.endPoint.js";
const router = Router();

router.get(
  "/add",
  fileUpload(fileValidation.image).single("image"),
  auth(subcategoryEndpoint.CURDoperation),
  validation(validator.add),
  asyncHandler(subcategoryController.add)
);
router.put(
  "/update/:subcategoryId",
  auth(subcategoryEndpoint.CURDoperation),
  fileUpload(fileValidation.image).single("image"),
  validation(validator.updateSubcategory),
  asyncHandler(subcategoryController.updateSubcategory)
);
router.delete(
  "/delete/:subcategoryId",
  auth(subcategoryEndpoint.CURDoperation),
  validation(validator.deleteSubcategory),
  asyncHandler(subcategoryController.deleteSubcategory)
);
router.get(
  "/getById/:id",

  validation(validator.getById),
  asyncHandler(subcategoryController.getById)
);
router.get(
  "/searchKey",

  validation(validator.searchKey),
  asyncHandler(subcategoryController.getByName)
);
router.get(
  "/getAllSubcategories",

  validation(validator.getAllSubcategories),
  asyncHandler(subcategoryController.getAllSubcategories)
);

export default router;
