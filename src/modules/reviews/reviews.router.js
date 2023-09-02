import { Router } from "express";
import * as reviewController from "./controller/review.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as validator from "./reviews.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import reviewEndpoint from "./reviews.endPoint.js";
const router = Router();

router.get(
  "/:id",
  auth(reviewEndpoint.CURDoperation),
  validation(validator.add),
  asyncHandler(reviewController.add)
);

export default router;
