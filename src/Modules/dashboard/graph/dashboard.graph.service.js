import { CompanyModel } from "../../../DB/Models/company.model.js"
import { UserModel } from "../../../DB/Models/user.model.js"
import * as dbService from "../../../DB/dbService.js"
export const getAllUsers=async(parent ,args)=>{ 
  
return await dbService.find({model:UserModel,filter:{isDeleted:false}})


}


export const getAllCompanies=async(parent ,args)=>{ 
  
  return await dbService.find({model:CompanyModel,filter:{isDeleted:false}})
  
  
  }