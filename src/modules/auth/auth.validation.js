import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const add = {
  body: Joi.object({
    userName: generalFields.name.required(),
    email: generalFields.email.required(),
    phone: generalFields.phone.required(),
    DOB: Joi.date(),
    password: generalFields.password.required(),
    cPassword: generalFields.cPassword.required(),
    role: Joi.string().valid("Admin", "User"),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
  file: generalFields.file.required(),
};
export const confirmEmail = {
  body: Joi.object({
    code: Joi.string().required(),
    email: generalFields.email.required(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};
export const login = {
  body: Joi.object({
    password: generalFields.password.required(),
    email: generalFields.email.required(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};

export const forgetPasswordMail = {
  body: Joi.object({
    email: generalFields.email.required(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};
export const forgetPassword = {
  body: Joi.object({
    email: generalFields.email.required(),
    newPassword: generalFields.password.required(),
    cNewPassword: Joi.valid(Joi.ref("newPassword")).required(),
    code: Joi.string().max(6).required(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};
