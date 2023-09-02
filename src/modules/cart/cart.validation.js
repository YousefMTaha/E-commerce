import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const update = {
  body: Joi.object({
    productId: generalFields.id.required(),
    quantity: Joi.number().min(1).integer().required(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};

export const add = {
  body: Joi.object({
    productId: generalFields.id.required(),
    quantity: Joi.number().min(1).integer().required(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};

export const clearCart = {
  body: Joi.object({}).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};
export const getCart = {
  body: Joi.object({}).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};

export const deleteOneEle = {
  body: Joi.object({
    productId:generalFields.id.required()
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};
