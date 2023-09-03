import { StatusCodes } from "http-status-codes";
import couponModel from "../../../../DB/model/Coupon.model.js";
import { ModifyError } from "../../../utils/classError.js";

export const addCoupon = async (req, res, next) => {
  const { code, amount, expireDate, noOfUsers } = req.body;
  const checkCode = await couponModel.findOne({ code });
  if (checkCode)
    return next(new ModifyError("code is already exist", StatusCodes.CONFLICT));

  const date = new Date(expireDate).getTime();
  if (Date.now() >= date) {
    return next(
      new ModifyError("invalid expire date", StatusCodes.BAD_REQUEST)
    );
  }

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

export const updateCoupon = async (req, res, next) => {
  const { id } = req.params;
  const checkCoupon = await couponModel.findById(id);
  if (!checkCoupon)
    return next(new ModifyError("Coupon doesn't exist", StatusCodes.NOT_FOUND));

  if (req.body.code) {
    const checkCode = await couponModel.findOne({
      _id: { $ne: id },
      code: req.body.code,
    });
    if (checkCode) {
      return next(
        new ModifyError("code is already exist", StatusCodes.CONFLICT)
      );
    }
  }
  if (req.body.expireDate) {
    const date = new Date(req.body.expireDate).getTime();

    if (Date.now() >= date) {
      return next(
        new ModifyError("invalid expire date", StatusCodes.BAD_REQUEST)
      );
    }
  }
  await couponModel.updateOne({ _id: id }, req.body);
  return res.status(200).json({ message: "done" });
};
