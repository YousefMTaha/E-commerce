import { Router } from "express";
import * as brandController from "./controller/brand.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { IdValidator, validation } from "../../middleware/validation.js";
import * as validator from "./brand.validation.js";
import { auth } from "../../middleware/auth.js";
import brandEndpoint from "./brand.endPoint.js";
const router = Router();

router.get(
  "/add",
  auth(brandEndpoint.CURDoperation),
  fileUpload(fileValidation.image).single("image"),
  validation(validator.add),
  asyncHandler(brandController.add)
  );
  
  router.get(
    "/getAllBrands",
    validation(validator.getAllBrands),
    asyncHandler(brandController.getAllBrands)
  );

router
  .route("/:id")
  .get(validation(IdValidator), asyncHandler(brandController.getById))
  .delete(
    auth(brandEndpoint.CURDoperation),
    validation(IdValidator),
    asyncHandler(brandController.remove)
  )
  .put(
    auth(brandEndpoint.CURDoperation),
    fileUpload(fileValidation.image).single("logo"),
    validation(validator.update),
    asyncHandler(brandController.update)
  );
export default router;
