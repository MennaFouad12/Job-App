import joi from "joi";
import { generalField } from "../../middleware/validation.middleware.js";



export const banUserSchema = joi.object({
  userId:generalField.id.required(),
}).required()

export const banCompanySchema = joi.object({
  companyId:generalField.id.required(),
}).required()