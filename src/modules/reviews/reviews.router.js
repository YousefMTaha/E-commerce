import { Router } from "express";
import * as reviewController from "./controller/review.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as validator from "./reviews.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import reviewEndpoint from "./reviews.endPoint.js";
const router = Router();

router
  .route("/:id")
  .get(
    auth(reviewEndpoint.CURDoperation),
    validation(validator.add),
    asyncHandler(reviewController.add)
  )
  .put(
    auth(reviewEndpoint.CURDoperation),
    validation(validator.update),
    asyncHandler(reviewController.update)
  )
  .delete(
    auth(reviewEndpoint.CURDoperation),
    validation(validator.remove),
    asyncHandler(reviewController.remove)
  );

export default router;
