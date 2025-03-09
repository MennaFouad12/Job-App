import { Router } from "express";
import * as appService from "./application.service.js";
import { authentication,authorization } from "../../middleware/auth.middleware.js";

import * as appValidation from "./application.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { fileValidation, upload, uploadCloud } from "../../utils/file uploading/multerUpload.js";

const router = Router();

router.post(
  "/",
 authentication(),
   authorization(["User"]),
  validation(appValidation.addAppSchema),
  upload(fileValidation.images,"upload/applications").single("image"),
  asyncHandler(appService.addApp)
);

// router.patch(
//   "/confirmOtp",
//   validation(authValidation.confirmEmailSchema),
//   asyncHandler(authService.confirmOtp)
// );
// router.post(
//   "/login",
//   validation(authValidation.loginSchema),
//   asyncHandler(authService.login)
// );
// router.get(
//   "/refresh_token",

//   asyncHandler(authService. refresh_token)
// );
// router.patch("/forgot_Password", validation(authValidation.forgotPasswordSchema), asyncHandler(authService.sendOtpForForgotPassword));
// router.patch("/reset_Password", validation(authValidation.resetPasswordSchema), asyncHandler(authService.resetPassword));
// router.post("/loginWithGmail",  asyncHandler(authService.loginWithGmail));
export default router;
