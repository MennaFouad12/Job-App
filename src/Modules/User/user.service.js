
import { defaultImage, UserModel } from "../../DB/Models/user.model.js";
import * as dbService from "../../DB/dbService.js";
import { emailEmitter } from "../../utils/email/email.event.js";
import { compareHash, hash } from "../../utils/hashing/hash.js";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";
export const getProfile = async (req, res, next) => {
  const user = await dbService.findOne({
    model: UserModel,
    filter: { _id: req.user._id, isDeleted: false },
    

  })

  return res.status(200).json({
    success: true,
    message: "User Profile",
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      DOB: user.DOB,
      phone: user.plainPhone, 
    },
  });

};
export const shareProfile = async (req, res, next) => {
  const { profileId } = req.params;
  const user = await dbService.findOne({
    model: UserModel,
    filter: { _id: profileId, isDeleted: false },
  

  })

  return res.status(200).json({
    success: true,
    message: "User Profile Data",
    user: {
      userName: `${user.firstName} ${user.lastName}`,
      mobileNumber: user.plainPhone, // Return the actual phone number
      profilePic: user.profilePic,
      coverPic: user.coverPic,
    },
  });

};
//to change email
//email otp to old email, new email otp
export const updateEmail = async (req, res, next) => {
  const { email } = req.body;
  if (await dbService.findOne({ model: UserModel, filter: { email } }))
    return next(new Error("Email Exist", { cause: 409 }));
  await dbService.updateOne({ model: UserModel, filter: { _id: req.user._id }, data: { tempEmail: email } });


  emailEmitter.emit("sendEmail", req.user.email, req.user.userName, req.user._id);
  emailEmitter.emit("updateEmail", email, req.user.userName, req.user._id);

  return res.status(200).json({
    success: true,
    message: "User Profile",
  })
};

export const resetEmail = async (req, res, next) => {
  const { oldCode, newCode } = req.body;
  if (!compareHash({ plainText: oldCode, hash: req.user.confirmEmailOTP }) || !compareHash({ plainText: newCode, hash: req.user.tempEmailOTP }))
    return next(new Error("In-valid Code", { cause: 400 }));

  const user = await dbService.updateOne({
    model: UserModel,
    filter: { _id: req.user._id },
    data: {
      email: req.user.tempEmail,
      changedCredentialsTime: Date.now(),
      $unset: { tempEmail: "", tempEmailOTP: "", confirmEmailOTP: "" },
    },
  });
  return res.status(200).json({ success: true, data: { user } });

};


export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!compareHash({ plainText: oldPassword, hash: req.user.password }))
    return next(new Error("In-valid Password", { cause: 400 }));
  const hashPassword = hash({ plainText: newPassword });
  const user = await dbService.updateOne({
    model: UserModel,
    filter: { _id: req.user._id },
    data: {
      password: hashPassword,
      changedCredentialsTime: Date.now(),
    },
  });


  return res.status(200).json({ success: true, message: "Password Updated Successfully" });

};

// export const updateProfile = async (req, res, next) => {
//   const { firstName, lastName, gender, phone, DOB } = req.body;
  
//   const user = await dbService.findOneAndUpdate({
//     model: UserModel,
//     filter: { _id: req.user._id },
//     data: req.body,
//     options: { new: true, runValidator: true }
//   })

//   return res.status(200).json({ success: true, data: { user } });

// };


export const updateProfile = async (req, res, next) => {

    const { firstName, lastName, gender, phone, DOB } = req.body;
    const updateData = {};

    // Add fields to update only if they are provided in the request
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (gender) updateData.gender = gender;
    if (DOB) updateData.DOB = new Date(DOB);

    // If the phone number is being updated, hash it before saving
    if (phone) {
      const hashedPhone = await bcrypt.hash(phone, 10);
      updateData.phone = hashedPhone;
    }

    // Find user and update the provided fields
    const user = await dbService.findOneAndUpdate({
      model: UserModel,
      filter: { _id: req.user._id },
      data: updateData,
      options: { new: true, runValidators: true } // Ensures validation
    });

    if (!user) {
      return next(new Error("User not found", { cause: 404 }));
    }

    return res.status(200).json({ success: true, data: { user } });


};

export const uploadProfilePic = async (req, res, next) => {
  const user = await dbService.findByIdAndUpdate({
    model: UserModel,
    id: req.user._id,
    data: { 
      profilePic: { 
        secure_url: req.file.path, 
        public_id: req.file.filename 
      } 
    },
    options: { new: true }
  });
  return res.status(200).json({ success: true, data: { user } });
}
export const uploadCoverPic = async (req, res, next) => {
  const user = await dbService.findByIdAndUpdate({
    model: UserModel,
    id: req.user._id,
    data: { 
      coverPic: { 
        secure_url: req.file.path, 
        public_id: req.file.filename 
      } 
    },
    options: { new: true }
  })
  return res.status(200).json({ success: true, data: { user } });
}



export const deleteProfileImages = async (req, res, next) => {
  const user = await dbService.findById({
    model: UserModel,
    id: req.user._id,

  })

  const imagePath = path.resolve(".", user.profilePic.secure_url);
  fs.unlinkSync(imagePath);
  user.profilePic = { secure_url: defaultImage, public_id: "" };
  
  await user.save();
  return res.status(200).json({ success: true, data: { user } });
}

export const deleteCoverImages = async (req, res, next) => {
  const user = await dbService.findById({
    model: UserModel,
    id: req.user._id,

  })

  const imagePath = path.resolve(".", user.coverPic.secure_url);
  fs.unlinkSync(imagePath);
  user.coverPic = { secure_url: defaultImage, public_id: "" };
  
  await user.save();
  return res.status(200).json({ success: true, data: { user } });
}




export const softDeleteAccount = async (req, res, next) => {

  
  const user = await dbService.findById({
    model: UserModel,
    id: { _id: req.user._id },
  });

  if (!user) {
    return next(new Error("user Not Found", { cause: 404 }));
  }
  //admin and owner of the post can make soft delete

  if (user.createdBy.toString() == req.user._id.toString() || req.user.role == roleType.Admin) {
    user.isDeleted = true;
    user.deletedBy = req.user._id;
    await user.save();
    return res.status(200).json({ success: true, data: { user } });

  }
  else {
    return next(new Error("Unauthorized", { cause: 401 }));
  }
};