import joi from "joi";
import { generalField } from "../../middleware/validation.middleware.js";

export const addCompanySchema= joi.object({
  companyName:generalField.firstName.required(),
  companyEmail:generalField.email.required(),
  numberOfEmployees:generalField.numberOfEmployees.required(),
  description:generalField.description.required(),
  address:generalField.address,
  HRs: joi.array().items(generalField.id).required()
}).required()


export const updateCompanySchema= joi.object({
  companyId:generalField.id.required(),
  companyName:generalField.firstName,
  companyEmail:generalField.email,
  numberOfEmployees:generalField.numberOfEmployees,
  description:generalField.description,
  address:generalField.address,
}).required()
// export const updateEmailSChema= joi.object({
//   email:generalField.email.required()
// }).required() 

// export const resetEmailSChema= joi.object({
// oldCode:generalField.code.required(),
// newCode:generalField.code.required(),
// }).required() 

// export const updatePasswordSchema= joi.object({
//   oldPassword:generalField.password.required(),
//   newPassword:generalField.password.not(joi.ref("oldPassword")).required(),
// confirmPassword:generalField.confirmPassword.valid(joi.ref("newPassword")).required(),
//   }).required() 


//   export const updateProfileSchema= joi.object({
//     userName:generalField.userName,
//     address:generalField.address,
//     gender:generalField.gender,
//     phone:generalField.phone,
//     DOB:generalField.DOB
//     }).required() 