import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const add = {
  body: Joi.object({
    name: generalFields.name.required(),
    slug: generalFields.name,
    categoryId: generalFields.id.required(),
  }).required(),
  params: Joi.object({}).required(),
  file: generalFields.file.required(),
  query: Joi.object({}).required(),
};

export const deleteSubcategory = {
  params: Joi.object({
    subcategoryId: generalFields.id.required(),
  }).required(),
  body: Joi.object({}).required(),
  query: Joi.object({}).required(),
};
export const getById = {
  body: Joi.object({}).required(),
  params: Joi.object({
    id :generalFields.id.required()
  }).required(),
  query: Joi.object({}).required(),
};
export const getAllSubcategories = {
  body: Joi.object({}).required(),
  params: Joi.object({}).required(),
  query: Joi.object().required(),
};

export const searchKey = {
  body: Joi.object({}).required(),
  params: Joi.object({}).required(),
  query: Joi.object({
    searchKey: Joi.string().required(),
  }).required(),
};

export const updateSubcategory = {
  body: Joi.object({
    name: generalFields.name.required(),
    categoryId: generalFields.id.required(),
  }).required(),
  params: Joi.object({
    subcategoryId: generalFields.id.required(),
  }).required(),
  query: Joi.object({}).required(),
  file: generalFields.file,
};
