import joi from "joi";
import { generalField } from "../../middleware/validation.middleware.js";

export const addJobSchema= joi.object({
  jobTitle:generalField.firstName.required(),
  seniorityLevel:generalField.seniorityLevel.required(),
  
  workingTime:generalField.workingTime.required(),
  companyId:generalField.id.required(),

}).required()



export const updateJobSchema= joi.object({
  jobTitle:generalField.firstName,
  seniorityLevel:generalField.seniorityLevel,
  
  workingTime:generalField.workingTime,
  companyId:generalField.id,
  id:generalField.id.required()
}).required()

export const addAppSchema= joi.object({

  jobId:generalField.id.required(),
  userCV: joi.object({
    secure_url: joi.string().uri().required(), // Must be a valid URL
    public_id: joi.string().required() // Must be a string
  }).required(),
}).required()

export const updateAppSchema= joi.object({
  applicationId:generalField.id.required(),
  status:joi.string().valid("accepted","rejected")
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