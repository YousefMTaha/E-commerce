import orderModel from "../../../../DB/model/Order.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import reviewModel from "../../../../DB/model/Review.model.js";
import { ModifyError } from "../../../utils/classError.js";
import { StatusCodes } from "http-status-codes";
export const add = async (req, res, next) => {
  const { content, rating } = req.body;
  const productId = req.params.id;
  const isAuth = await orderModel.findOne({
    userId: req.user._id,
    "products.productId": productId,
  });
  if (isAuth.status != "delivered") {
    return next(
      new ModifyError(
        "You need to try product first before review it",
        StatusCodes.BAD_REQUEST
      )
    );
  }
  const checkReview = await reviewModel.findOne({
    createdBy: req.user._id,
  });
  if (checkReview)
    return next(
      new ModifyError("you already reviewed this product", StatusCodes.CONFLICT)
    );

  const product = await productModel.findById(productId);
  if (!product)
    return next(new ModifyError("product not found", StatusCodes.NOT_FOUND));
  const avgRate =
    (product.avgRate * product.rateNo + rating) / (product.rateNo + 1);
  await productModel.updateOne(
    {
      _id: productId,
    },
    {
      avgRate,
      $inc: { rateNo: 1 },
    }
  );
  const review = await reviewModel.create({
    content,
    productId,
    rating,
    createdBy: req.user._id,
  });
  return res.status(StatusCodes.ACCEPTED).json({ message: "done", review });
};
