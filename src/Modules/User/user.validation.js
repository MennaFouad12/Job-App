import joi from "joi";
import { generalField } from "../../middleware/validation.middleware.js";

export const shareProfileSChema= joi.object({
  profileId:generalField.id.required()
}).required()
export const updateEmailSChema= joi.object({
  email:generalField.email.required()
}).required() 

export const resetEmailSChema= joi.object({
oldCode:generalField.code.required(),
newCode:generalField.code.required(),
}).required() 

export const updatePasswordSchema= joi.object({
  oldPassword:generalField.password.required(),
  newPassword:generalField.password.not(joi.ref("oldPassword")).required(),
// confirmPassword:generalField.confirmPassword.valid(joi.ref("newPassword")).required(),
  }).required() 


  export const updateProfileSchema= joi.object({
    // userName:generalField.userName,
    firstName:generalField.firstName,
    lastName:generalField.lastName,
    address:generalField.address,
    gender:generalField.gender,
    phone:generalField.phone,
    DOB:generalField.DOB
    }).required() 