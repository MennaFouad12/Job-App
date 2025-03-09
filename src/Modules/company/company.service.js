
import { defaultImage, UserModel } from "../../DB/Models/user.model.js";
import * as dbService from "../../DB/dbService.js";
import { emailEmitter } from "../../utils/email/email.event.js";
import { compareHash, hash } from "../../utils/hashing/hash.js";
import path from "path";
import fs from "fs";
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";
import { CompanyModel } from "../../DB/Models/company.model.js";
export const addCompany = async (req, res, next) => {
  const {companyName,companyEmail,numberOfEmployees,description,HRs} = req.body;

if (await dbService.findOne({model: CompanyModel, filter: { companyEmail,companyName}}))
    return next(new Error("Email Exist", { cause: 409 }));
if(HRs){
  for (let i = 0; i < HRs.length; i++) {
    if (!await dbService.findOne({model: UserModel, filter: { _id: HRs[i]}}))
      return next(new Error("HR not found", { cause: 404 }));
  }
}

const company = await dbService.create({
    model: CompanyModel,
    data:{...req.body,createdBy: req.user._id}
  });
  return res.status(200).json({
    success: true,
    message: "company created successfully",
    company,
  });

};
// export const shareProfile = async (req, res, next) => {
//   const { profileId } = req.params;
//   let user = undefined;
//   if (profileId == req.user._id.toString()) {
//     user = req.user;
//   }
//   else {
//     user = await dbService.findOneAndUpdate({
//       model: UserModel,
//       filter: { _id: profileId, isDeleted: false },
//       data: {
//         $push: {
//           viewers: {
//             userId: req.user._id,
//             time: Date.now()
//           }
//         }
//       }, select: "userName email image"
//     });
//   }
//   return user ? res.status(200).json({ success: true, data: { user } })
//     : next(new Error("User Not Found", { cause: 404 }));

// };
// //to change email
// //email otp to old email, new email otp
// export const updateEmail = async (req, res, next) => {
//   const { email } = req.body;
//   if (await dbService.findOne({ model: UserModel, filter: { email } }))
//     return next(new Error("Email Exist", { cause: 409 }));
//   await dbService.updateOne({ model: UserModel, filter: { _id: req.user._id }, data: { tempEmail: email } });


//   emailEmitter.emit("sendEmail", req.user.email, req.user.userName, req.user._id);
//   emailEmitter.emit("updateEmail", email, req.user.userName, req.user._id);

//   return res.status(200).json({
//     success: true,
//     message: "User Profile",
//   })
// };

// export const resetEmail = async (req, res, next) => {
//   const { oldCode, newCode } = req.body;
//   if (!compareHash({ plainText: oldCode, hash: req.user.confirmEmailOTP }) || !compareHash({ plainText: newCode, hash: req.user.tempEmailOTP }))
//     return next(new Error("In-valid Code", { cause: 400 }));

//   const user = await dbService.updateOne({
//     model: UserModel,
//     filter: { _id: req.user._id },
//     data: {
//       email: req.user.tempEmail,
//       changedCredentialsTime: Date.now(),
//       $unset: { tempEmail: "", tempEmailOTP: "", confirmEmailOTP: "" },
//     },
//   });
//   return res.status(200).json({ success: true, data: { user } });

// };


// export const updatePassword = async (req, res, next) => {
//   const { oldPassword, newPassword } = req.body;

//   if (!compareHash({ plainText: oldPassword, hash: req.user.password }))
//     return next(new Error("In-valid Password", { cause: 400 }));
//   const hashPassword = hash({ plainText: newPassword });
//   const user = await dbService.updateOne({
//     model: UserModel,
//     filter: { _id: req.user._id },
//     data: {
//       password: hashPassword,
//       changedCredentialsTime: Date.now(),
//     },
//   });


//   return res.status(200).json({ success: true, message: "Password Updated Successfully" });

// };

export const updateCompany = async (req, res, next) => {
  const { legalAttachment, ...updateData } = req.body;
  const { companyId } = req.params;
const company=  dbService.findOne({ model: CompanyModel, filter: {_id: companyId,createdBy: req.user._id } })
if(!company) return next(new Error("company Not Found", { cause: 404 }));
  
    const updatedCompany = await dbService.findOneAndUpdate({
      model: CompanyModel,
      filter: { _id: companyId },
      data: updateData,
      options: { new: true, runValidator: true }
    })
  
    return res.status(200).json({ success: true, data: { updatedCompany } });


};




export const deleteCompany = async (req, res, next) => {
  
  const { companyId } = req.params;
const company= await dbService.findOne({ model: CompanyModel, filter: {_id: companyId,createdBy: req.user._id } })
// if(!company) return next(new Error("company Not Found", { cause: 404 }));
if (!company) {
  return next(new Error("Company Not Found", { cause: 404 }));
}
  
if (company.createdBy.toString() == req.user._id.toString() || req.user.role == roleType.Admin) {
  company.isDeleted = true;
  company.deletedBy = req.user._id;
  await company.save();
  return res.status(200).json({ success: true, data: { company } });

}
  
    return res.status(200).json({ success: true, message: "unauthorized" });


};
export const getJobs = async (req, res, next) => {

    

    const { companyId } = req.params;

    // Find company and populate related jobs
    const company = await CompanyModel.findById(companyId).populate("jobs");

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    return res.status(200).json({ success: true, data: { company } });
  }

  export const getCompanyWithName = async (req, res, next) => {

    

    const { companyName } = req.query;

    // Find company and populate related jobs
    const company = await dbService.findOne({ model: CompanyModel, filter: { companyName } })

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    return res.status(200).json({ success: true, data: { company } });
  }



  export const uploadLogo = async (req, res, next) => {
    const { companyId } = req.params;
    const company = await dbService.findByIdAndUpdate({
      model: CompanyModel,
      id: companyId,
      data: { 
        Logo: { 
          secure_url: req.file.path, 
          public_id: req.file.filename 
        } 
      },
      options: { new: true }
    });
    return res.status(200).json({ success: true, data: { company } });
  }
  export const uploadCoverPic = async (req, res, next) => {
    const { companyId } = req.params;
    const company = await dbService.findByIdAndUpdate({
      model: CompanyModel,
      id: companyId,
      data: { 
        coverPic: { 
          secure_url: req.file.path, 
          public_id: req.file.filename 
        } 
      },
      options: { new: true }
    })
    return res.status(200).json({ success: true, data: { company } });
  }
  
  
  
  export const deleteLogo = async (req, res, next) => {
    const { companyId } = req.params;
    const company = await dbService.findById({
      model: CompanyModel,
      id: companyId,
  
    })
  
    const imagePath = path.resolve(".", company.Logo.secure_url);
    fs.unlinkSync(imagePath);
    company.Logo = { secure_url: defaultImage, public_id: "" };
    
    await company.save();
    return res.status(200).json({ success: true, data: { company } });
  }
  
  export const deleteCoverImages = async (req, res, next) => {
    const { companyId } = req.params;
    const company = await dbService.findById({
      model: CompanyModel,
      id:companyId,
  
    })
  
    const imagePath = path.resolve(".", company.coverPic.secure_url);
    fs.unlinkSync(imagePath);
    company.coverPic = { secure_url: defaultImage, public_id: "" };
    
    await company.save();
    return res.status(200).json({ success: true, data: { company } });
  }