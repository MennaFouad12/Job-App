
import { defaultImage, UserModel } from "../../DB/Models/user.model.js";
import * as dbService from "../../DB/dbService.js";
import { emailEmitter } from "../../utils/email/email.event.js";
import { compareHash, hash } from "../../utils/hashing/hash.js";
import path from "path";
import fs from "fs";
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";
import { CompanyModel } from "../../DB/Models/company.model.js";
import { JobModel } from "../../DB/Models/job.model.js";
import mongoose, { Schema, model } from "mongoose";
import { ApplicationModel } from "../../DB/Models/application.model.js";
import { emitNewApplication } from "../../utils/socket/socket.js";
import {sendApplicationEmail} from "../../utils/email/statusEmail.js";
// export const addJob = async (req, res, next) => {
//   const {companyName,companyEmail,numberOfEmployees,description} = req.body;

// if (await dbService.findOne({model: CompanyModel, filter: { companyEmail,companyName}}))
//     return next(new Error("Email Exist", { cause: 409 }));

// const company = await dbService.create({
//     model: CompanyModel,
//     data:{...req.body,createdBy: req.user._id}
//   });
//   return res.status(200).json({
//     success: true,
//     message: "company created successfully",
//     company,
//   });

// };



export const addJob = async (req, res, next) => {

    const { jobTitle, workingTime, seniorityLevel, companyId } = req.body;

    // Ensure required fields are provided
    if (!jobTitle || !workingTime || !seniorityLevel || !companyId) {
      return next(new Error("Missing required fields", { cause: 400 }));
    }

    const company = await CompanyModel.findById(companyId);
    if (!company) {
      return next(new Error("Company not found", { cause: 404 }));
    }

    // Check if user is the owner or an HR of the company
    if (company.createdBy.toString() !== req.user._id.toString() && !company.HRs.includes(req.user._id)) {
      return next(new Error("Access denied. Only HRs or the company owner can create jobs.", { cause: 401 }));
    }
    // Create job
    const newJob = await dbService.create({
      model: JobModel,  
      data: {
        
      
      jobTitle,
      
      workingTime,
      seniorityLevel,
      
      companyId,
      addedBy: req.user._id, // Set HR or Company Owner as job creator
      }
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });

  
};

export const updateJob = async (req, res, next) => {
const { id } = req.params;
  const { jobTitle, workingTime, seniorityLevel, companyId } = req.body;

  

  const job = await JobModel.findById(id);
  if (!job) {
    return next(new Error("job not found", { cause: 404 }));
  }

  const company = await CompanyModel.findById(job.companyId);
  if (!company) {
    return next(new Error("company not found", { cause: 404 }));
  }
  if (company.createdBy.toString() !== req.user._id.toString() ) {
    return next(new Error("Access denied. Only HRs or the company owner can create jobs.", { cause: 401 }));
  }

  const updatedJob = await dbService.findOneAndUpdate({
    model: JobModel,  
    filter: {_id: id},
    data: req.body,
  }); 
  

  return res.status(201).json({
    success: true,
    message: "Job updated successfully",
    job: updatedJob,
  });


};

export const deleteJob = async (req, res, next) => {
  const { id } = req.params;
    
  
    
  
    const job = await JobModel.findById(id);
    if (!job) {
      return next(new Error("job not found", { cause: 404 }));
    }
  
    const company = await CompanyModel.findById(job.companyId);
    if (!company) {
      return next(new Error("company not found", { cause: 404 }));
    }
    if (!company.HRs.includes(req.user._id) ) {
      return next(new Error("Access denied. Only HRs or the company owner can create jobs.", { cause: 401 }));
    }
  
    // const deletedJob = await dbService.findOneAndDelete({
    //   model: JobModel,  
    //   filter: {_id: id},
    // });
    
    const deletedJob = await JobModel.findByIdAndDelete(id);
  
    return res.status(201).json({
      success: true,
      message: "Job deleted successfully",
      job: deletedJob,
    });
  
  
  };



  // export const getJobs = async (req, res, next) => {
  
  //     const { companyId, jobId } = req.params;
  //     const { search, skip = 0, limit = 10 } = req.query;
  // const sort = "createdAt";
  //     // Convert skip & limit to numbers
  //     const paginationOptions = {
  //       skip: parseInt(skip),
  //       limit: parseInt(limit),
  //       sort: { [sort]: -1 }, // Sort in descending order (latest first)
  //     };
  
  //     let company;
      
  //     // If searching by company name
  //     if (search) {
  //       company = await CompanyModel.findOne({ name: new RegExp(search, "i") });
  //       if (!company) return next(new Error("Company not found", { cause: 404 }));
  //     }
  
  //     // Find company either by ID or by search name
  //     const filter = {
  //       companyId: company ? company._id : companyId,
  //     };
  
  //     // If jobId is provided, return a single job
  //     if (jobId) {
  //       const job = await JobModel.findOne({ _id: jobId, ...filter });
  //       if (!job) return next(new Error("Job not found", { cause: 404 }));
  
  //       return res.status(200).json({
  //         success: true,
  //         job,
  //       });
  //     }
  
  //     // Get all jobs for the company with pagination
  //     const jobs = await JobModel.find(filter)
  //       .skip(paginationOptions.skip)
  //       .limit(paginationOptions.limit)
  //       .sort(paginationOptions.sort);
  
  //     const totalCount = await JobModel.countDocuments(filter);
  
  //     return res.status(200).json({
  //       success: true,
  //       totalCount,
  //       jobs,
  //     });
    
  // };

  export const getJobs = async (req, res, next) => {
    try {
      const { companyIdentifier, jobId } = req.params; // Can be companyId or company name
      const { skip = 0, limit = 10, sort = "createdAt" } = req.query;
  
      let company;
  
      // Check if companyIdentifier is an ObjectId or a Name
      if (mongoose.Types.ObjectId.isValid(companyIdentifier)) {
        // If valid ObjectId, assume it's a companyId
        company = await CompanyModel.findById(companyIdentifier);
      } else {
        // If not a valid ObjectId, assume it's a company name
        company = await CompanyModel.findOne({ companyName: new RegExp(companyIdentifier, "i") });
      }
  
      if (!company) {
        return next(new Error("Company not found", { cause: 404 }));
      }
  
      // Build job filter
      let filter = { companyId: company._id };
  
      // If jobId is provided, filter for a single job
      if (jobId) {
        filter._id = jobId;
      }
  
      // Fetch jobs with pagination
      const jobs = await JobModel.find(filter)
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .sort({ [sort]: -1 });
  
      const totalCount = await JobModel.countDocuments(filter);
  
      // If jobId is provided, return only that job
      if (jobId && jobs.length > 0) {
        return res.status(200).json({ success: true, job: jobs[0] });
      }
  
      return res.status(200).json({
        success: true,
        totalCount,
        jobs,
      });
    } catch (error) {
      return next(error);
    }
  };
  
  

  export const getFilteredJobs = async (req, res, next) => {
    try {
      
      const { skip = 0, limit = 10, sort = "createdAt",jobTitle, workingTime,jobLocation ,seniorityLevel,technicalSkills } = req.query;
      let filter = {};
      if (workingTime) filter.workingTime = workingTime;
      if (jobLocation) filter.jobLocation = jobLocation;
      if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
      if (jobTitle) filter.jobTitle = new RegExp(jobTitle, "i"); // Case-insensitive search
      if (technicalSkills) filter.technicalSkills = { $in: technicalSkills.split(",") }; // Search for multiple skills
      
      // Fetch jobs with pagination
      const jobs = await JobModel.find(filter)
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .sort({ [sort]: -1 });
  
      const totalCount = await JobModel.countDocuments(filter);
  
      
  
      return res.status(200).json({
        success: true,
        totalCount,
        jobs,
      });
    } catch (error) {
      return next(error);
    }
  };
  

  export const getApplicationsForJob = async (req, res, next) => {
    try {
      const { jobId } = req.params;
      const { skip = 0, limit = 10, sort = "createdAt" } = req.query;
  
      // Find the job
      const job = await JobModel.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
  
      // Find the company
      const company = await CompanyModel.findById(job.companyId);
      if (!company) {
        return res.status(404).json({ success: false, message: "Company not found" });
      }
  
      // Ensure the user is an HR or company owner
      if (!company.HRs.includes(req.user._id) && company.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ success: false, message: "Access denied. Only HRs or the company owner can view applications." });
      }
  
      // Fetch applications with user details (virtual populate)
      const applications = await ApplicationModel.find({ jobId })
        .populate("user", "userName email phone ") // Populate only selected fields from User
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .sort({ [sort]: -1 });
  
      const totalCount = await ApplicationModel.countDocuments({ jobId });
  
      return res.status(200).json({
        success: true,
        totalCount,
        applications,
      });
    } catch (error) {
      return next(error);
    }
  };


  export const applyForJob = async (req, res, next) => {
    
      const { jobId } = req.body;
      const userId = req.user._id;
  
      // Check if the job exists
      const job = await JobModel.findById(jobId).populate("companyId");
      if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
  
      // Check if the user has already applied
      const existingApplication = await ApplicationModel.findOne({ jobId, userId });
      if (existingApplication) {
        return res.status(400).json({ success: false, message: "You have already applied for this job" });
      }
  
      // Process the user's CV file
      const userCV = {
        secure_url: req.body?.userCV.secure_url || "", // Cloudinary/Multer file path
        public_id: req.body?.userCV.public_id || "", // Unique file identifier
      };
  
      // Create new job application
      const application = new ApplicationModel({
        jobId,
        userId,
        userCV,
        status: "pending",
      });
  
      await application.save();
  
      const company = await CompanyModel.findById(job.companyId);
      const hrIds = company.HRs; 
      hrIds.forEach((hrId) => {
        emitNewApplication(hrId.toString(), {
          jobId: job._id,
          applicantId: userId,
          applicationId: application._id,
          message: "A new job application has been submitted!",
        });
      });
  
      return res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        application,
      });
  
    
  };
  

  export const updateApplicationStatus =async (req, res, next) => {
    const { applicationId } = req.params; // Get application ID from URL
    const { status } = req.body; // Status can be "accepted" or "rejected"
  
    // Validate status
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
  
    // Find the application in the database
    const application = await ApplicationModel.findById(applicationId)
      .populate("userId", "email name") // Get user email for notification
      .populate("jobId", "title"); // Get job details
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    const job = await JobModel.findById(application.jobId);
  const company = await CompanyModel.findById(job.companyId);
    // Check if HR is authorized to update this job's application
    // if (job.companyId.toString() !== req.user.companyId.toString()) {
    //   return res.status(403).json({ success: false, message: "Unauthorized" });
    // }
    if (!company.HRs.includes(req.user._id)) {
      return next(new Error("Unauthorized", { cause: 403 }));
    }
    // Update application status
    application.status = status;
    await application.save();
  const user=await UserModel.findById(application.userId)
    // Notify user via email
    sendApplicationEmail(user.email, status, job.jobTitle);
  
    res.json({ success: true, message: `Application ${status}` });
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

// export const updateCompany = async (req, res, next) => {
//   const { legalAttachment, ...updateData } = req.body;
//   const { companyId } = req.params;
// const company=  dbService.findOne({ model: CompanyModel, filter: {_id: companyId,createdBy: req.user._id } })
// if(!company) return next(new Error("company Not Found", { cause: 404 }));
  
//     const updatedCompany = await dbService.findOneAndUpdate({
//       model: CompanyModel,
//       filter: { _id: companyId },
//       data: updateData,
//       options: { new: true, runValidator: true }
//     })
  
//     return res.status(200).json({ success: true, data: { updatedCompany } });


// };




// export const deleteCompany = async (req, res, next) => {
  
//   const { companyId } = req.params;
// const company= await dbService.findOne({ model: CompanyModel, filter: {_id: companyId,createdBy: req.user._id } })
// // if(!company) return next(new Error("company Not Found", { cause: 404 }));
// if (!company) {
//   return next(new Error("Company Not Found", { cause: 404 }));
// }
  
// if (company.createdBy.toString() == req.user._id.toString() || req.user.role == roleType.Admin) {
//   company.isDeleted = true;
//   company.deletedBy = req.user._id;
//   await company.save();
//   return res.status(200).json({ success: true, data: { company } });

// }
  
//     return res.status(200).json({ success: true, message: "unauthorized" });


// };
// export const getJobs = async (req, res, next) => {
//   try {
//     const { companyId } = req.params; // Company ID from URL
//     const { jobId, page = 1, limit = 10, sort = "createdAt", search } = req.query;

//     let filter = {};

//     // If a companyId is provided, filter by company
//     if (companyId) {
//       filter.companyId = companyId;
//     }

//     // If searching for a company by name
//     if (search) {
//       const company = await dbService.findOne({
//         model: CompanyModel,
//         filter: { companyName: { $regex: search, $options: "i" } }, // Case-insensitive search
//       });

//       if (company) {
//         filter.companyId = company._id;
//       } else {
//         return res.status(404).json({ success: false, message: "Company not found" });
//       }
//     }

//     // If a specific jobId is provided, filter by jobId
//     if (jobId) {
//       filter._id = jobId;
//     }

//     // Pagination
//     const skip = (page - 1) * limit;

//     // Get total count of jobs matching filter
//     const totalCount = await dbService.count({ model: JobModel, filter });

//     // Fetch jobs
//     const jobs = await dbService.findMany({
//       model: JobModel,
//       filter,
//       skip,
//       limit,
//       sort: { [sort]: -1 }, // Default to descending order (newest first)
//     });

//     return res.status(200).json({
//       success: true,
//       totalCount,
//       page: Number(page),
//       totalPages: Math.ceil(totalCount / limit),
//       jobs,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const uploadImageDisk = async (req, res, next) => {
//   const user = await dbService.findByIdAndUpdate({
//     model: UserModel,
//     id: req.user._id,
//     data: { image: req.file.path },
//     options: { new: true }
//   })
//   return res.status(200).json({ success: true, data: { user } });
// }

// export const uploadMultipleImages = async (req, res, next) => {
//   console.log({ data: req.files });
//   const user = await dbService.findByIdAndUpdate({
//     model: UserModel,
//     id: req.user._id,
//     data: { coverImages: req.files.map((obj) => obj.path) },
//     options: { new: true }
//   })
//   return res.status(200).json({ success: true, data: { user } });
// }

// export const deleteProfileImages = async (req, res, next) => {
//   const user = await dbService.findById({
//     model: UserModel,
//     id: req.user._id,

//   })
//   const imagePath = path.resolve(".", user.image);
//   fs.unlinkSync(imagePath);
//   user.image = defaultImage;
//   await user.save();
//   return res.status(200).json({ success: true, data: { user } });
// }

// export const uploadOnCloud = async (req, res, next) => {
// const user=await dbService.findById({model:UserModel,id:req.user._id})
// const results = await cloudinary.uploader.upload(req.file.path,{folder:`Users/${req.user._id}/profilePicture`});
// const { public_id, secure_url } = results;
// user.image={public_id,secure_url}
// await user.save();
// return res.status(200).json({ success: true, data: { user } });

// }