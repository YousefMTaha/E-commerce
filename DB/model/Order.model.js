import mongoose, { Model, Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    address: { type: String, required: true },
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        paymentPrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    phone: { type: String, required: true },
    price: { type: Number, required: true },
    coupon: String,
    paymentPrice: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cash", "card"], default: "cash" },
    status: {
      type: String,
      enum: ["placed", "delivered", "waitingPayment", "canceled"],
      default: "placed",
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model.Order || model("Order", orderSchema);

export default orderModel;
