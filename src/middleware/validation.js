import { StatusCodes } from "http-status-codes";
import joi from "joi";
import { Types } from "mongoose";
const dataMethods = ["body", "params", "query", "headers", "file","files"];

const validateObjectId = (value, helper) => {
  if (Types.ObjectId.isValid(value)) {
    return true;
  } else {
    return helper.message("In-valid objectId");
  }
};
export const generalFields = {
  email: joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 4,
    tlds: { allow: ["com", "net"] },
  }),
  password: joi.string(),
  cPassword: joi.string().valid(joi.ref("password")).required(),
  id: joi.string().custom(validateObjectId),
  phone: joi.string().regex(/^01[0-2,5]{1}[0-9]{8}$/),
  name: joi.string(),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
  }),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const validationErr = [];
    dataMethods.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationErr.push(validationResult.error);
        }
      }
    });

    if (validationErr.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Validation Err", validationErr });
    }
    return next();
  };
};

export const IdValidator = {
  body: joi.object({}).required(),
  params: joi
    .object({
      id: generalFields.id.required(),
    })
    .required(),
  query: joi.object({}).required(),
};
