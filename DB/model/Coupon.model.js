import mongoose, { model, Schema, Types } from "mongoose";

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, lowercase: true },
    amount: Number,
    expireDate: { type: String, required: true },
    usedBy: [{ type: Types.ObjectId }],
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    noOfUsers: Number,
  },
  { timestamps: true }
);

const couponModel = mongoose.models.Coupon || model("Coupon", couponSchema);

export default couponModel;
