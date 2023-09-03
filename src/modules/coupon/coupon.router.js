import { Router } from "express";
import * as couponController from "./controller/coupon.js";
import { validation } from "../../middleware/validation.js";
import * as validator from "./coupon.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth, roles } from "../../middleware/auth.js";
import couponEndPoint from "./coupon.endPoint.js";
const router = Router();

router.get(
  "/",
  auth(couponEndPoint.CURDoperation),
  validation(validator.add),
  asyncHandler(couponController.addCoupon)
);
router.get(
  "/getAllCoupons",
  auth(couponEndPoint.CURDoperation),
  validation(validator.getCoupon),
  asyncHandler(couponController.getAllCoupons)
);
router.put(
  "/:id",
  auth(couponEndPoint.CURDoperation),
  validation(validator.update),
  asyncHandler(couponController.updateCoupon)
);

export default router;
