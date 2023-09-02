import { StatusCodes } from "http-status-codes";
import couponModel from "../../../../DB/model/Coupon.model.js";
import { ModifyError } from "../../../utils/classError.js";

export const addCoupon = async (req, res, next) => {
  const { code, amount, expireDate,noOfUsers } = req.body;
  const checkCode = await couponModel.findOne({ code });
  if (checkCode)
    return next(new ModifyError("code is already exist", StatusCodes.CONFLICT));
  const coupon = await couponModel.create({
    code,
    amount,
    expireDate,
    noOfUsers,
    createdBy: req.user._id,
  });
  return res.status(StatusCodes.ACCEPTED).json({ message: "done", coupon });
};

export const getAllCoupons = async (req, res, next) => {
  const coupon = await couponModel.find();
  if (!coupon)
    return next(
      new ModifyError("there is no coupon exist", StatusCodes.NOT_FOUND)
    );
  return res.status(StatusCodes.ACCEPTED).json({ Message: "done", coupon });
};
