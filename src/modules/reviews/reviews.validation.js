import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const add = {
  body: Joi.object({
    content: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required(),
  }).required(),
  params: Joi.object({
    id: generalFields.id.required(),

  }).required(),
  query: Joi.object({}).required(),
};
