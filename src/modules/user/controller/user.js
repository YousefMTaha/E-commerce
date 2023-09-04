import { StatusCodes } from "http-status-codes";
import userModel from "../../../../DB/model/User.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import { ModifyError } from "../../../utils/classError.js";

export const addToFavorite = async (req, res, next) => {
  const productId = req.params.id;
  const product = await productModel.findById(productId);
  if (!product)
    return next(
      new ModifyError("Product doesn't exist", StatusCodes.NOT_FOUND)
    );
  await userModel.updateOne(
    { _id: req.user._id },
    {
      $addToSet: { favorites: productId },
    }
  );
  return res.status(StatusCodes.ACCEPTED).json({ message: "done" });
};

export const removeFromFavorite = async (req, res, next) => {
  const productId = req.params.id;
  const product = await productModel.findById(productId);
  if (!product)
    return next(
      new ModifyError("Product doesn't exist", StatusCodes.NOT_FOUND)
    );
  if (!req.user.favorites.includes(productId))
    return next(
      new ModifyError("product doesn't in you favorites", StatusCodes.NOT_FOUND)
    );
  await userModel.updateOne(
    { _id: req.user._id },
    {
      $pull: { favorites: productId },
    }
  );
  return res.status(StatusCodes.ACCEPTED).json({ message: "done" });
};

export const getFavorites = async (req, res, next) => {
  if (!req.user.favorites.length)
    return next(new ModifyError("Favorite is empty", StatusCodes.NOT_FOUND));
  const user = await userModel.findById(req.user._id).populate([
    {
      path: "favorites",
    },
  ]);
  user.favorites = user.favorites.filter((ele) => {
    if (ele) {
      return ele;
    }
  });
  user.save();
  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: "done", favorites: user.favorites });
};
