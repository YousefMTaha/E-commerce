import mongoose, { model, Schema, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    content: { type: String, required: true },
    rating: { type: Number, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    productId: { type: Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

const reviewModel = mongoose.models.Review || model("Review", reviewSchema);

export default reviewModel;
