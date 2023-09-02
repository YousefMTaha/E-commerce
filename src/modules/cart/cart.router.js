import { Router } from "express";
import * as cartController from "./controller/cart.js";
import { auth, roles } from "../../middleware/auth.js";
import { IdValidator, validation } from "../../middleware/validation.js";
import * as validator from "./cart.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import cartEndpoint from "./cart.endPoint.js";
const router = Router();

router
  .route("/")
  .get(auth(cartEndpoint.CURDoperation) , validation(validator.getCart), asyncHandler(cartController.getCart))
  .put(
    auth(cartEndpoint.CURDoperation),
    validation(validator.update),
    asyncHandler(cartController.updateCart)
  )
  .post(
    auth(cartEndpoint.CURDoperation),
    validation(validator.add),
    asyncHandler(cartController.addToCart)
  )
  .delete(
    auth(cartEndpoint.CURDoperation),
    validation(validator.deleteOneEle),
    asyncHandler(cartController.removeFromCart)
  );

router.delete(
  "/clearCart",
  auth(cartEndpoint.CURDoperation),
  validation(validator.clearCart),
  asyncHandler(cartController.clearCart)
);

export default router;
