import { Router } from "express";
import { authentication,authorization } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import * as dashboardService from "./dashboard.service.js"; 
import * as dashboardValidation from "./dashboard.validation.js";
import {validation} from "../../middleware/validation.middleware.js"
import { fileValidation, upload, uploadCloud } from "../../utils/file uploading/multerUpload.js";

const router = Router();
router.patch(
  "/banUser/:userId",
  authentication(), // User must be authenticated
  authorization(["User"]), // Only Users can apply

  validation(dashboardValidation.banUserSchema), // Validate input data
  asyncHandler(dashboardService.banUser) // Call the service function
);
router.patch(
  "/banCompany/:companyId",
  authentication(), // User must be authenticated
  authorization(["User"]), // Only Users can apply

  validation(dashboardValidation.banCompanySchema), // Validate input data
  asyncHandler(dashboardService.banCompany) // Call the service function
);
router.patch(
  "/approveCompany/:companyId",
  authentication(), // User must be authenticated
  authorization(["User"]), // Only Users can apply

  validation(dashboardValidation.banCompanySchema), // Validate input data
  asyncHandler(dashboardService.approveCompany) // Call the service function
);
export default router;