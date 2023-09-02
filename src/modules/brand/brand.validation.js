import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const add = {
  body: Joi.object({
    name: generalFields.name.required(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
  file: generalFields.file.required(),
};

export const getAllBrands = {
  body: Joi.object({}).required(),
  params: Joi.object({}).required(),
  query: Joi.object().required(),
};

export const update = {
  body: Joi.object({
    name: generalFields.name,
  }).required(),
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
  query: Joi.object({}).required(),
  file: generalFields.file,
};
