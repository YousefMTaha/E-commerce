import { Router } from "express";
import * as orderController from "./controller/order.js";
import * as validator from "./order.validation.js";
import orderEndpoint from "./order.endPoint.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth } from "../../middleware/auth.js";
import { IdValidator, validation } from "../../middleware/validation.js";

const router = Router();

router.get(
  "/",
  auth(orderEndpoint.CURDoperation),
  validation(validator.create),
  asyncHandler(orderController.createOrder)
);
router.post("/webhook", asyncHandler(orderController.webhook));
router.put(
  "/cancel-order/:id",
  auth(orderEndpoint.CURDoperation),
  validation(IdValidator),
  asyncHandler(orderController.cancelOrder)
);
export default router;
