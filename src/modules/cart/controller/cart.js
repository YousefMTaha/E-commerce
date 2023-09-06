import cartModel from "../../../../DB/model/Cart.model.js";
import productModule from "../../../../DB/model/Product.model.js";
import { ModifyError } from "../../../utils/classError.js";
import { StatusCodes } from "http-status-codes";

export const addToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const checkProduct = await productModule.findById(productId);
  if (!checkProduct)
    return next(new ModifyError("Product is not exist", StatusCodes.NOT_FOUND));

  if (quantity > checkProduct.stock || !checkProduct.stock) {
    await productModule.updateOne(
      { _id: productId },
      { $addToSet: { wishList: req.user._id } }
    );
    return next(
      new ModifyError(
        !checkProduct.stock
          ? `out of stock`
          : `available stock is ${checkProduct.stock}`,
        StatusCodes.BAD_REQUEST
      )
    );
  }

  // let cartProduct = await cartModel.findOne(
  //   {
  //     userId: req.user.id,
  //     products: {
  //       $elemMatch: {
  //         productId,
  //       },
  //     },
  //   },
  //   { "products.$": 1 }
  // );

  // if (cartProduct) {
  //   cartProduct.products.quantity = quantity;
  //   console.log({quantity:cartProduct.products.quantity});
  //   await cartProduct.save();
  //   return res
  //     .status(StatusCodes.ACCEPTED)
  //     .json({ message: "done", cartProduct });
  // }

  const cart = await cartModel.findOne({ userId: req.user._id });
  let productExist = false;
  for (const product of cart.products) {
    if (productId == product.productId.toString()) {
      productExist = true;
      product.quantity = quantity;
      break;
    }
  }
  if (!productExist) {
    cart.products.push({ productId, quantity });
  }
  await cart.save();
  return res.status(StatusCodes.ACCEPTED).json({ message: "done", cart });
};

export const getCart = async (req, res, next) => {
  const cart = await cartModel.findOne({ userId: req.user._id }).populate([
    {
      path: "products.productId",
      select: "name description stock price paymentPrice discount",
    },
  ]);
  if (!cart.products.length)
    return next(new ModifyError("Cart is empty", StatusCodes.NOT_FOUND));
  let totalPrice = 0;
  cart.products = cart.products.filter((ele) => {
    if (ele.productId && ele.productId.stock) {
      totalPrice += ele.quantity * ele.productId.paymentPrice;
      return ele;
    }
  });
  cart.save();
  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: "done", cart, totalPrice });
};

export const removeFromCart = async (req, res, next) => {
  const { productId } = req.body;
  const product = await cartModel.findOne({
    userId: req.user._id,
    "products.productId": productId,
  });

  if (!product)
    return next(
      new ModifyError("product ID doesn't exist", StatusCodes.NOT_FOUND)
    );

  await cartModel.updateOne(
    { userId: req.user._id },
    {
      $pull: { products: { productId: { $in: [productId] } } },
    }
  );

  return res.status(StatusCodes.ACCEPTED).json({ message: "done" });
};

export const updateCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const cart = await cartModel.findOne(
    { userId: req.user._id },
    { "products.productId": productId }
  );

  if (!cart)
    return next(
      new ModifyError(
        "product doesn't exist in your cart",
        StatusCodes.NOT_FOUND
      )
    );

  const product = await productModule.findById(productId);
  if (!product) {
    return next(
      new ModifyError(
        "product has been removed by the owner",
        StatusCodes.NOT_FOUND
      )
    );
  }

  if (quantity > product.stock || !product.stock)
    return next(
      new ModifyError(
        product.stock ? `available stock is ${product.stock}` : "out of stock",
        StatusCodes.BAD_REQUEST
      )
    );

  const test = await cartModel.updateOne(
    {
      userId: req.user._id,
      "products.productId": productId,
    },
    {
      "products.productId": productId,
    }
  );
  console.log({ test });
  // console.log({cart});
  // cart.products.quantity = quantity;
  // await cart.save();
  return res.status(StatusCodes.ACCEPTED).json({ message: "done" });
};

export const clearCart = async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    { products: [] },
    { new: true }
  );
  return cart
    ? res.status(StatusCodes.ACCEPTED).json({ message: "done", cart })
    : next(new ModifyError("cart is already empty", StatusCodes.BAD_REQUEST));
};
