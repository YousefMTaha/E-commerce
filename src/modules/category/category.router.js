import { Router } from "express";
import * as categoryController from "./controller/category.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as Val from "./category.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import {auth} from "../../middleware/auth.js";
import  categoryEndpoint  from "./category.endPoint.js";
const router = Router();

router.post(
  "/",
  fileUpload(fileValidation.image).single("image"),
  auth(categoryEndpoint.CURDoperation),
  validation(Val.addCategoryVal),
  asyncHandler(categoryController.addCategory)
);

// router.put(
//   "/:categoryId",
//   fileUpload(fileValidation.image).single("image"),
//   auth(categoryEndpoint.CURDoperation),
//   validation(Val.updateCategoryVal),
//   asyncHandler(categoryController.updateCategory)
// );
router.delete(
  "/:categoryId",
  auth(categoryEndpoint.CURDoperation),
  validation(Val.deleteCategoryVal),
  asyncHandler(categoryController.deleteCategory)
);
router.put(
  "/update/:categoryId",
  fileUpload(fileValidation.image).single("image"),
  auth(categoryEndpoint.CURDoperation),
  validation(Val.updateCategoryVal),
  asyncHandler(categoryController.updateCategory)
);
router.get(
  "/searchKey",

  validation(Val.findByNameVal),
  asyncHandler(categoryController.findByName)
);
router.get(
  "/getById/:id",

  validation(Val.findByIdVal),
  asyncHandler(categoryController.findById)
);
router.get(
  "/getAllCategories",
  validation(Val.getAllCategories),
  asyncHandler(categoryController.getAllCategories)
);

export default router;
