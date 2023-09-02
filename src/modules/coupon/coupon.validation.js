import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";
export const add = {
  body: Joi.object({
    code: generalFields.name.required(),
    amount: Joi.number().min(1).max(100).required(),
    expireDate: Joi.date().required(),
    noOfUsers:Joi.number().min(1)
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};
export const getCoupon = {
  body: Joi.object({}).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};
