import { create } from "../../DB/dbService.js";
import { providersType, roleType, UserModel } from "../../DB/Models/user.model.js";
import { emailEmitter } from "../../utils/email/email.event.js";
import { compareHash, hash } from "../../utils/hashing/hash.js";
import { generateToken, verifyToken } from "../../utils/token/token.js";
import {OAuth2Client} from 'google-auth-library';
import * as dbService from "../../DB/dbService.js";
import dotenv from "dotenv";
import { decodedToken, tokenTypes } from "../../middleware/auth.middleware.js";
import otpGenerator from "otp-generator"
import bcrypt from "bcrypt";

dotenv.config({ path: '../../config/.env' });



export const register = async (req, res, next) => {
  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    DOB: new Date(req.body.DOB)
  };
 
  
  if (await dbService.findOne({model: UserModel, filter: {email: userData.email}}))
    return next(new Error("Email Exist", { cause: 409 }));
  
  
  const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
  const otpExpiresIn = new Date(Date.now() + 30 * 60 * 1000);
  

  const user = await dbService.create({
    model: UserModel,
    data: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      email: userData.email,
      password: userData.password,
      DOB: userData.DOB,
      
      otp: [{ code:hash( {plainText :otp,saltRounds:10}), type: 'confirmEmail', expiresIn: otpExpiresIn }]
    }
  });
 
  emailEmitter.emit("sendEmail", userData.email, "register", otp, userData.firstName);
  
  return res.status(201).json({
    success: true,
    message: "User Created Successfully",
    user,
  });
};


export const confirmOtp = async (req, res, next) => {
    const { email, code } = req.body;

    
    
    // Find user by ID
    const user = await dbService.findOne({model:UserModel,filter:{email}});
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if OTP exists
    console.log(code,"-------------",user.otp[0].code);
    if (!user.otp[0].code) {
      return res.status(400).json({ message: 'No OTP found for this user' });
    }
    
    // Check OTP expiry
    const now = new Date();
    if (now > user.otp[0].expiresIn) {
      // Clear expired OTP
      user.otp[0].code = null;
      user.otp[0].expiresIn = null;
      await user.save();
      
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }
    
    // Check OTP type
    if (user.otp[0].type !== 'confirmEmail') {
      return res.status(400).json({ message: 'Invalid OTP type' });
    }
    
    // Compare OTP
    if (!compareHash({ plainText: code, hash: user.otp[0].code }))
          return next(new Error("In-valid Code", { cause: 400 }));
  
    
    user.confirmEmail= true;
    // user.otp[0].code = null;
    // user.otp[0].expiresAt = null;
    user.otp=[];
    await user.save();
    
    res.status(200).json({ message: 'Email verified successfully' });




}
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await dbService.findOne({model:UserModel,filter:{email}});

  if (!user) return next(new Error("In-valid User", { cause: 404 }));
  if (user.confirmEmail == false)
    return next(new Error("Email Not Verified", { cause: 400 }));

  if (!compareHash({ plainText: password, hash: user.password }))
return next(new Error("In-valid Password", { cause: 400 }));
  const access_token = generateToken({payload:{id:user._id},
  signature:user.role===roleType.User?
  process.env.USER_ACCESS_TOKEN:
  process.env.ADMIN_ACCESS_TOKEN,
  options: {expiresIn:process.env.ACCESS_TOKEN_EXPIRE}
});
  const refresh_token = generateToken({payload:{id:user._id},
    signature:user.role===roleType.User?
    process.env.USER_REFRESH_TOKEN:
    process.env.ADMIN_REFRESH_TOKEN,
    options: {expiresIn:process.env.REFRESH_TOKEN_EXPIRE}
  });
  user.createdBy=user._id;
  await user.save();
  return res.status(200).json({
    success: true,
    message: "Login Successfully",
    tokens: { access_token, refresh_token },
  });
};


 
export const refresh_token = async (req, res, next) => {
  const {autherization} = req.headers;
  const user = await decodedToken(autherization,tokenTypes.refresh,next);
const access_token = generateToken({payload:{id:user._id},
  signature:user.role===roleType.User?
  process.env.USER_ACCESS_TOKEN:
  process.env.ADMIN_ACCESS_TOKEN});
  const refresh_token = generateToken({payload:{id:user._id},
    signature:user.role===roleType.User?
    process.env.USER_REFRESH_TOKEN:
    process.env.ADMIN_REFRESH_TOKEN});

  
  return res.status(200).json({
    success: true,
  
    tokens: { access_token, refresh_token },
  });  
};
// export const forgotPassword = async (req, res, next) => {
//   const { email } = req.body;

//   const user = await dbService.findOne({model:UserModel,filter:{email,isDeleted:false}});

//   if (!user) return next(new Error("In-valid User", { cause: 404 }));

// emailEmitter.emit("forgotPassword", email, user.userName);
  
//   return res.status(200).json({
//     success: true,
  
//   message: "Email Sent Successfully",
//   });  
// };




export const sendOtpForForgotPassword = async (req, res, next) => {
  const { email } = req.body;

  // Check if the user exists
  const user = await dbService.findOne({ model: UserModel, filter: { email } });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  // Generate the OTP
  const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
  const otpExpiresIn = new Date(Date.now() + 30 * 60 * 1000); // OTP expires in 30 minutes

  // Save the OTP in the user's document
  user.otp.push({ code: await bcrypt.hash(otp, 10), type: 'forgetPassword', expiresIn: otpExpiresIn });
  await user.save();

  // Send the OTP via email
  emailEmitter.emit("sendEmail", user.email, "forgetPassword", otp, user.firstName);

  return res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
};
// export const resetPassword = async (req, res, next) => {
//   const { email,code,password } = req.body;

//   const user = await dbService.findOne({model:UserModel,filter:{email,isDeleted:false}});


//   if (!user) return next(new Error("In-valid User", { cause: 404 }));

//   if (!compareHash({ plainText: code, hash: user.forgetPasswordOTP }))
//     return next(new Error("In-valid Code", { cause: 400 }));
//   const hashPassword = hash({ plainText: password }); 
//   await dbService.updateOne({model:UserModel,filter:{email},data:{password:hashPassword,$unset:{forgetPasswordOTP:""}}});
//   // await UserModel.updateOne(
//   //   { email },
//   //   { password: hashPassword, $unset: { forgetPasswordOTP: "" } }
//   // )
  
//   return res.status(200).json({
//     success: true,
  
//   message: "password reset Successfully",
//   });  
// };

export const resetPassword = async (req, res, next) => {
  const { email, code, newPassword } = req.body;

  // Find user by email
  const user = await dbService.findOne({ model: UserModel, filter: { email } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if OTP exists
  if (!user.otp[0]?.code || user.otp[0]?.type !== "forgetPassword") {
    return res.status(400).json({ message: "No OTP found for password reset" });
  }

  // Check OTP expiry
  const now = new Date();
  if (now > user.otp[0].expiresIn) {
    user.otp = [];
    await user.save();
    return res.status(400).json({ message: "OTP expired. Please request a new one." });
  }

  // Compare OTP
  if (!compareHash({ plainText: code, hash: user.otp[0].code }))
    return next(new Error("In-valid Code", { cause: 400 }));
  // Hash new password and update user
  user.password = newPassword
  user.otp = []; // Clear OTP after use
  await user.save();

  return res.status(200).json({ message: "Password reset successfully" });
};

export const loginWithGmail = async (req, res, next) => {
  const { idToken } = req.body;

  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const { email_verified, email, name, picture } = await verify();

  if (!email_verified)
    return next(new Error("Email Not Verified", { cause: 400 }));

  let user = await dbService.findOne({ model: UserModel, filter: { email } });

  if (user?.providers === providersType.System)
    return next(new Error("In-valid Login Method", { cause: 409 }));

  if (!user) {
    user = await dbService.create({
      model: UserModel,
      data: {
        confirmEmail: email_verified,
        userName: name,
        email,
        image: picture,
        providers: providersType.Google,
      },
    });
  }

  const access_token = generateToken({
    payload: { id: user._id },
    signature: process.env.USER_ACCESS_TOKEN,
    options: { expiresIn: String(process.env.ACCESS_TOKEN_EXPIRE) },
  });
  
  const referesh_token = generateToken({
    payload: { id: user._id },
    signature: process.env.USER_REFRESH_TOKEN,
    options: { expiresIn: String(process.env.REFRESH_TOKEN_EXPIRE) },
  });
  

  return res.status(200).json({
    success: true,
    results: {
      access_token,
      referesh_token,
    },
  });
};
