import mongoose, { model, Schema, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, lowercase: true },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String, required: true },
    stock: { type: Number, default: 1, required: true },
    price: { type: Number, default: 0, required: true },
    discount: { type: Number, default: 0 },
    paymentPrice: { type: Number, required: true },
    colors: Array,
    sizes: Array,
    image: { type: Object, required: true },
    coverImage: [{ type: Object }],
    categoryId: { type: Types.ObjectId, required: true },
    subcategoryId: { type: Types.ObjectId, required: true },
    brandId: { type: Types.ObjectId, required: true },
    avgRate: { type: Number, default: 0 },
    rateNo: { type: Number, default: 0 },
    soldItem: { type: Number, default: 0 },
    createdBy: { type: Types.ObjectId, required: true },
    wishList: [{ type: Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const productModel = mongoose.models.Product || model("Product", productSchema);

export default productModel;
