import mongoose, { Schema, Types, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "max length 2 char"],
    },
    email: {
      type: String,
      unique: [true, "email must be unique value"],
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin"],
    },

    confirmEmail: {
      type: Boolean,
      default: false,
    },

    image: Object,
    DOB: String,
    code: String,
    favorites: [{
      type: Types.ObjectId,
      ref: "Product",
    }],
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model.User || model("User", userSchema);
export default userModel;
