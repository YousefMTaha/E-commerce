import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

const productValidation = (value, helper) => {
  const schema = Joi.object({
    value: Joi.array().items({
      productId: generalFields.id.required(),
      quantity: Joi.number().min(0).required(),
    }),
  });
  const result = schema.valid({ value });
  return result.error ? helper.message(result.error) : true;
};
export const create = {
  body: Joi.object({
    address: generalFields.name.required(),
    phone: generalFields.phone.required(),
    coupon: generalFields.name.required(),
    products: Joi.custom({
      productId: generalFields.id.required(),
      quantity: Joi.number().min(0).required(),
    }).required(),
    paymentMethod: Joi.string().valid("cash", "card"),
    status: Joi.string().valid(
      "placed",
      "delivered",
      "waitingPayment",
      "canceled"
    ),
    notes: Joi.string(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};
