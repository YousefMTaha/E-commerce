import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const add = {
    body:Joi.object({
    address:generalFields.name.required(),
    phone:generalFields.phone.required(),
    paymentMethod:Joi.string().valid('cash','visa').required(),
    }).required()
}