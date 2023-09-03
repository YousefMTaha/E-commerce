import mongoose, { model, Schema, Types } from "mongoose";

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, lowercase: true },
    amount: Number,
    expireDate: { type: String, required: true },
    noOfUsers: Number,
    usedBy: [{ type: Types.ObjectId }],
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const couponModel = mongoose.models.Coupon || model("Coupon", couponSchema);

export default couponModel;
