import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

const validateColor = (value, helper) => {
  value = JSON.parse(value);
  const valueSchema = Joi.object({
    value: Joi.array().items(Joi.string().alphanum()),
  }).required();
  const validation = valueSchema.validate({ value });
  if (validation.error) return helper.message("invalid type of colors");
  else return true;
};
const validateSizes = (value, helper) => {
  value = JSON.parse(value);
  const valueSchema = Joi.object({
    value: Joi.array().items(Joi.string().alphanum()),
  }).required();
  const validation = valueSchema.validate({ value });
  if (validation.error) return helper.message("invalid type of sizes");
  else return true;
};
export const add = {
  body: Joi.object({
    name: generalFields.name.required(),
    slug: generalFields.name,
    description: generalFields.name.required(),
    quantity: Joi.number().min(1).integer().required(),
    price: Joi.number().min(0).required(),
    discount: Joi.number().min(0).max(100),
    paymentPrice: Joi.number(),
    colors: Joi.custom(validateColor),
    sizes: Joi.custom(validateSizes),
    categoryId: generalFields.id.required(),
    subcategoryId: generalFields.id.required(),
    brandId: generalFields.id.required(),
    avgRate: Joi.number(),
    soldItem: Joi.number(),
  }).required(),
  query: Joi.object({}).required(),
  param: Joi.object({}).required(),
  files  : Joi.object({
    image: Joi.array().items(generalFields.file.required()).length(1).required(),
    coverImage: Joi.array().items(generalFields.file).min(1).max(5),
  }).required(),
};

export const update = {
  body: Joi.object({
    name: generalFields.name,
    slug: generalFields.name,
    description: generalFields.name,
    quantity: Joi.number().min(1).integer(),
    price: Joi.number().min(0),
    discount: Joi.number().min(0).max(100),
    paymentPrice: Joi.number(),
    colors: Joi.custom(validateColor),
    sizes: Joi.custom(validateSizes),
  }).required(),
  query: Joi.object({}).required(),
  param: Joi.object({}).required(),
  files: Joi.object({
    coverImage: Joi.array().items(generalFields.file).max(5),
    image: Joi.array().items(generalFields.file).length(1),
  }),
};

// export const remove = {
//   body: Joi.object({}).required(),
//   params: Joi.object({
//     id: generalFields.id.required(),
//   }).required(),
//   query: Joi.object({}).required(),
// };
