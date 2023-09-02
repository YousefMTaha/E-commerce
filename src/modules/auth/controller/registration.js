import { StatusCodes } from "http-status-codes";
import userModel from "../../../../DB/model/User.model.js";
import { ModifyError } from "../../../utils/classError.js";
import cryptojs from "crypto-js";
import bcryptjs from "bcryptjs";
import cloudinary from "../../../utils/cloudinary.js";
import { htmlTemplate, sendEmail } from "../../../utils/email.js";
import { nanoid } from "nanoid";
import Jwt from "jsonwebtoken";
import cartModel from "../../../../DB/model/Cart.model.js";

export const add = async (req, res, next) => {
  const { DOB, userName, email, password, phone } = req.body;
  const isEmailExist = await userModel.findOne({ email });
  if (isEmailExist)
    return next(
      new ModifyError("email is already exist", StatusCodes.CONFLICT)
    );
  const passwordHash = bcryptjs.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );
  const phoneEnc = cryptojs.AES.encrypt(
    phone,
    process.env.ENCRYPTION_KEY
  ).toString();

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: "ecommerce/user" }
  );

  const user = await userModel.create({
    userName,
    email,
    password: passwordHash,
    phone: phoneEnc,
    image: {
      public_id,
      secure_url,
    },
    DOB,
    role:req.body.role? req.body.role : 'User'
  });
  const code = nanoid(6);
  const html = htmlTemplate(code);
  sendEmail({ to: email, subject: "Confirm Email", html });
  await userModel.updateOne({ email }, { code });

  await cartModel.create({ userId: user._id });
  return res.status(StatusCodes.ACCEPTED).json({ message: "Done", user });
};

export const confirmEmail = async (req, res, next) => {
  const { email, code } = req.body;
  const emailExist = await userModel.findOne({ email });

  if (!emailExist)
    return next(new ModifyError("user does not exist", StatusCodes.NOT_FOUND));
  if (emailExist.confirmEmail)
    return next(
      new ModifyError("your email already confirmed", StatusCodes.CONFLICT)
    );
  if (code != emailExist.code)
    return next(new ModifyError("invalid code", StatusCodes.BAD_REQUEST));
  const newCode = nanoid(6);
  await userModel.updateOne({ email }, { code: newCode, confirmEmail: true });
  return res.status(StatusCodes.ACCEPTED).json({ message: "done" });
};

export const forgetPasswordMail = async (req, res, next) => {
  const { email } = req.body;
  const checkEmail = await userModel.findOne({ email });
  if (!checkEmail)
    return next(
      new ModifyError(
        "you don't have account , you need to sign up",
        StatusCodes.NOT_FOUND
      )
    );
  const code = nanoid(6);
  const html = htmlTemplate(code);
  await sendEmail({ to: email, subject: "Forget Password Mail", html });
  await userModel.updateOne({ email }, { code });
  return res.json({ message: "done", message: "check you inbox" });
};

export const forgetPassword = async (req, res, next) => {
  const { code, email, newPassword } = req.body;
  const user = await userModel.findOne({ email });
  if (!user)
    return next(
      new ModifyError(
        "email doesn't exist you must signup",
        StatusCodes.NOT_FOUND
      )
    );
  if (code != user.code)
    return next(new ModifyError("invalid code", StatusCodes.BAD_REQUEST));
  const passwordHashed = bcryptjs.hashSync(
    newPassword,
    parseInt(process.env.SALT_ROUND)
  );
  const newCode = nanoid(6);
  await userModel.updateOne(
    { email },
    { password: passwordHashed, code: newCode }
  );
  return res.status(StatusCodes.ACCEPTED).json({ message: "done" });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user)
    return next(
      new ModifyError("invalid information", StatusCodes.BAD_REQUEST)
    );

  const checkPassword = bcryptjs.compareSync(password, user.password);
  if (!checkPassword)
    return next(
      new ModifyError("invalid information", StatusCodes.BAD_REQUEST)
    );

  if (!user.confirmEmail)
    return next(
      new ModifyError(
        "you must confirm your email first",
        StatusCodes.NOT_ACCEPTABLE
      )
    );
  const payload = {
    id: user._id,
    email: user.email,
  };
  const token = Jwt.sign(payload, process.env.TOKEN_SIGNATURE);

  return res.status(StatusCodes.ACCEPTED).json({ message: "done", token });
};
