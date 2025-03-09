import joi from "joi";
import { generalField } from "../../middleware/validation.middleware.js";

import { Types } from "mongoose";
export const addAppSchema = joi
  .object({
  


    userId:generalField.id.required(),
    jobId:generalField.id.required(),
    userCV:generalField.file.required(),
    status:joi.string().valid("pending","accepted","rejected")
  })
  .required();


  // export const registerSchema = joi
  // .object({
  //   // userName: generalField.userName.required(),
  //   firstName: joi.string().min(3).max(30).trim(),

  //   lastName: joi.string().min(3).max(30).trim(),
  //   email: generalField.email.required(),
  //   password: generalField.password.required(),
  //   confirmPassword: generalField.confirmPassword.required(),
  // })
  // .required();
export const confirmEmailSchema = joi
  .object({
    email: generalField.email.required(),
    code : generalField.code.required()
  })
  .required();


  export const loginSchema = joi
  .object({
  
    email: generalField.email.required(),
    password: generalField.password.required(),
  
  })
  .required();
  export const forgotPasswordSchema = joi
  .object({
  
    email: generalField.email.required(),
  
  
  })
  .required();
  export const resetPasswordSchema= joi
  .object({
    email: generalField.email.required(),
  
  
    code: generalField.code.required(),
    newPassword: generalField.password.required(),
  
  })
  .required();
