import { Router } from "express";
import * as productController from "./controller/product.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as validator from "./product.validation.js";
import { IdValidator, validation } from "../../middleware/validation.js";
import { auth, roles } from "../../middleware/auth.js";
import userRole from "./product.endPoint.js"
const router = Router();

router.get(
  "/add",
  auth(userRole.CRUDoPeration),
  fileUpload(fileValidation.image).fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 5,
    },
  ]),
  validation(validator.add),
  asyncHandler(productController.add)
);

router
  .route("/:id")
  .delete(auth(userRole.CRUDoPeration), validation(IdValidator), asyncHandler(productController.remove))
  .put(
    auth(userRole.CRUDoPeration),
    fileUpload(fileValidation.image).fields([
      {
        name: "image",
        maxCount: 1,
      },
      {
        name: "coverImage",
        maxCount: 5,
      },
    ]),
    validation(validator.update),
    asyncHandler(productController.update)
  );

router.get("/search", asyncHandler(productController.search));

export default router;
