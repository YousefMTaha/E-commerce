import { Router } from "express";
import * as orderController from "./controller/order.js";
import * as validator from "./order.validation.js";
import orderEndpoint from "./order.endPoint.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth } from "../../middleware/auth.js";

const router = Router();

router.get(
  "/",
  auth(orderEndpoint.CURDoperation),
  asyncHandler(orderController.createOrder)
);
router.post("/webhook", asyncHandler(orderController.webhook));

export default router;
