import productModel from "../../../../DB/model/Product.model.js";
import { ModifyError } from "../../../utils/classError.js";
import { StatusCodes } from "http-status-codes";
import cryptojs from "crypto-js";
import orderModel from "../../../../DB/model/Order.model.js";
import couponModel from "../../../../DB/model/Coupon.model.js";
import cartModel from "../../../../DB/model/Cart.model.js";
import createInvoice from "../../../utils/create invoice.js";
import { sendEmail } from "../../../utils/email.js";
import path from "path";
import { fileURLToPath } from "url";
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.PAYMENT_SECRET_KEY);

export const createOrder = async (req, res, next) => {
  const { address, coupon, phone, paymentMethod } = req.body;
  let { products } = req.body;
  if (coupon) {
    const checkCoupon = await couponModel.findOne({
      code: coupon,
    });
    if (!checkCoupon)
      return next(
        new ModifyError("Coupon doesn't exist", StatusCodes.NOT_FOUND)
      );
    const expDate = new Date(checkCoupon.expireDate).getTime();

    if (
      expDate < Date.now() ||
      checkCoupon.usedBy.length == checkCoupon.noOfUsers
    ) {
      return next(
        new ModifyError("coupon is expired", StatusCodes.BAD_REQUEST)
      );
    }
    if (checkCoupon.usedBy.includes(req.user.id)) {
      return next(
        new ModifyError(
          "you already used this coupon before",
          StatusCodes.BAD_REQUEST
        )
      );
    }
    req.body.coupon = checkCoupon;
  }

  if (!products) {
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart.products.length) {
      return next(new ModifyError("cart is empty", StatusCodes.BAD_REQUEST));
    }
    products = cart.products;
  }

  const orderProducts = [];
  const productIDS = [];
  let totalPrice = 0;
  for (const product of products) {
    const checkProduct = await productModel.findById(product.productId);
    if (!checkProduct || !checkProduct.stock) {
      return next(
        new ModifyError(
          `product with Id ${product.productId} ${
            !checkProduct ? "has been removed" : "out of stock"
          }`,
          StatusCodes.NOT_FOUND
        )
      );
    }
    if (product.quantity > checkProduct.stock) {
      return next(
        new ModifyError(
          `available stock is ${checkProduct.stock}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    orderProducts.push({
      productId: checkProduct._id,
      name: checkProduct.name,
      description: checkProduct.description,
      price: checkProduct.price,
      paymentPrice: checkProduct.paymentPrice,
      quantity: product.quantity,
    });
    productIDS.push(checkProduct._id);
    totalPrice += checkProduct.paymentPrice * product.quantity;
  }
  const paymentPrice =
    totalPrice - (totalPrice * (req.body.coupon?.amount || 0)) / 100;

  if (paymentMethod == "card") {
    req.body.status = "waitingPayment";
  }

  const phoneEncryption = cryptojs.AES.encrypt(
    phone,
    process.env.ENCRYPTION_KEY
  ).toString();

  const order = await orderModel.create({
    userId: req.user._id,
    address,
    products: orderProducts,
    phone: phoneEncryption,
    price: totalPrice,
    paymentMethod,
    paymentPrice,
    status: req.body.status,
    notes: req.body.notes,
    coupon: req.body.coupon?.code,
  });

  // const invoice = {
  //   customer: {
  //     email: req.user.email,
  //     paymentPrice,
  //     price: totalPrice,
  //     userName: req.user.userName,
  //     address,
  //   },
  //   items: orderProducts.map((ele) => {
  //     return {
  //       item: ele.name,
  //       description: ele.description,
  //       quantity: ele.quantity,
  //       amount: ele.paymentPrice,
  //     };
  //   }),
  //   subtotal: totalPrice,
  // };
  // const __dirname = path.dirname(fileURLToPath(import.meta.url));
  // const pdfPath = path.join(
  //   __dirname,
  //   `../../../utils/pdf/${req.user._id}.pdf`
  // );
  // createInvoice(invoice, pdfPath);
  // sendEmail({
  //   to: req.user.email,
  //   subject: `Order PDF`,
  //   attachments: [
  //     {
  //       fileName: `${req.user.userName} Order.pdf`,
  //       path: pdfPath,
  //       type: "application/pdf",
  //     },
  //   ],
  // });

  // if (paymentMethod == "card") {
  //   if (req.body.coupon) {
  //     const coupon = await stripe.coupons.create({
  //       percent_off: req.body.coupon.amount,
  //       duration: "once",
  //     });
  //     req.body.stripCoupon = coupon.id;
  //   }

  //   const payment = await stripe.checkout.sessions.create({
  //     payment_method_types: ["card"],
  //     mode: "payment",
  //     customer_email: req.user.email,
  //     cancel_url: process.env.CANCEL_URL,
  //     success_url: process.env.SUCCESS_URL,
  //     metadata: {
  //       orderId: order.id.toString(),
  //     },
  //     discounts: req.body.stripCoupon ? [{ coupon: req.body.stripCoupon }] : [],
  //     line_items: orderProducts.map((ele) => {
  //       return {
  //         price_data: {
  //           currency: "EGP",
  //           product_data: {
  //             name: ele.name,
  //           },
  //           unit_amount: ele.paymentPrice * 100,
  //         },
  //         quantity: ele.quantity,
  //       };
  //     }),
  //   });
  //   req.body.payment = payment;
  // }

  await cartModel.updateOne(
    { userId: req.user._id },
    {
      $pull: { products: { productId: { $in: productIDS } } },
    }
  );
  for (const product of products) {
    await productModel.updateOne(
      { _id: product.productId },
      {
        $inc: { stock: -product.quantity, soldItem: product.quantity },
      }
    );
  }
  if (req.body.coupon) {
    await couponModel.updateOne(
      {
        code: req.body.coupon.code,
      },
      {
        $push: {
          usedBy: req.user._id,
        },
      }
    );
  }

  return paymentMethod == "cash"
    ? res.status(StatusCodes.ACCEPTED).json({ message: "done", order })
    : res.json({ url: req.body.payment.url });
};

export const webhook = async (req, res) => {
  // const sig = req.headers["stripe-signature"];

  // const event = stripe.webhooks.constructEvent(
  //   req.body,
  //   sig,
  //   process.env.ENDPOINT_SECRET
  // );

  // if (event.type == "checkout.session.completed") {
  //   const updateOrder = await orderModel.findByIdAndUpdate(
  //     event.data.object.metadata.orderId,
  //     {
  //       status: "placed",
  //     },
  //     {
  //       new: true,
  //     }
  //   );
  //   res.json({ updateOrder });
  // } else {
  //   console.log(`Unhandled event type ${event.type}`);
  // }
};

export const cancelOrder = async (req, res, next) => {
  const { id } = req.params;
  const order = await orderModel.findById(id);
  if (!order)
    return next(new ModifyError("order doesn't exist", StatusCodes.NOT_FOUND));

  if (req.user._id != order.userId.toString()) {
    return next(
      new ModifyError("This order not belong to you", StatusCodes.BAD_REQUEST)
    );
  }
  const cancelOrderStatus = ["delivered", "canceled"];
  if (cancelOrderStatus.includes(order.status)) {
    return next(
      new ModifyError(
        "this Order can't be cancelled or already canceled",
        StatusCodes.BAD_REQUEST
      )
    );
  }
  for (const product of order.products) {
    await productModel.findByIdAndUpdate(product.productId, {
      $inc: { stock: product.quantity },
    });
  }

  if (order.coupon) {
    await couponModel.findOneAndUpdate(
      {
        code: order.coupon,
      },
      {
        $pull: { usedBy: req.user._id },
      }
    );
  }
  order.status = "canceled";
  await order.save();
  return res.status(StatusCodes.ACCEPTED).json({ message: "done" });
};
