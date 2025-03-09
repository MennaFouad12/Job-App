import { Router } from "express";
import * as authService from "./auth.service.js";
import * as authValidation from "./auth.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
const router = Router();

router.post(
  "/register",

  validation(authValidation.registerSchema),
  asyncHandler(authService.register)
);

router.patch(
  "/confirmOtp",
  validation(authValidation.confirmEmailSchema),
  asyncHandler(authService.confirmOtp)
);
router.post(
  "/login",
  validation(authValidation.loginSchema),
  asyncHandler(authService.login)
);
router.get(
  "/refresh_token",

  asyncHandler(authService. refresh_token)
);
router.patch("/forgot_Password", validation(authValidation.forgotPasswordSchema), asyncHandler(authService.sendOtpForForgotPassword));
router.patch("/reset_Password", validation(authValidation.resetPasswordSchema), asyncHandler(authService.resetPassword));
// router.post("/loginWithGmail",  asyncHandler(authService.loginWithGmail));
export default router;
