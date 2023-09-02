import mongoose, { model, Schema, Types } from "mongoose";

const cartSchema = new Schema(
  {
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],
    userId: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const cartModel = mongoose.models.Cart || model("Cart", cartSchema);

export default cartModel;
