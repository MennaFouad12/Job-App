import { Router } from "express";
import { authentication,authorization } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import * as jobService from "./job.service.js"; 
import * as jobValidation from "./job.validation.js";
import {validation} from "../../middleware/validation.middleware.js"
import { fileValidation, upload, uploadCloud } from "../../utils/file uploading/multerUpload.js";

const router = Router();
router.patch(
  "/updateApplicationStatus/:applicationId",
  authentication(), // User must be authenticated
  authorization(["User"]), // Only Users can apply

  validation(jobValidation.updateAppSchema), // Validate input data
  asyncHandler(jobService.updateApplicationStatus) // Call the service function
);
router.post("/",
   authentication(),
   authorization(["User"]),
   validation(jobValidation.addJobSchema),
   asyncHandler(jobService.addJob));
  
   router.patch("/:id",
    authentication(),
    authorization(["User"]),
    validation(jobValidation.updateJobSchema),
    asyncHandler(jobService.updateJob));
    router.delete("/:id",
      authentication(),
      authorization(["User"]),
      
      asyncHandler(jobService.deleteJob));

      router.get(
        "/:jobId/applications",
        authentication(),
        authorization(["User", "Admin"]), // Only HRs & Admins can view applications
        asyncHandler(jobService.getApplicationsForJob)
      );
      router.get(
        "/:companyIdentifier/jobs/:jobId?", 
        authentication(),
        authorization(["User", "Admin"]), 
        asyncHandler(jobService.getJobs)
      );
      router.get(
        "/", 
        authentication(),
        authorization(["User", "Admin"]), 
        asyncHandler(jobService.getFilteredJobs)
      );


      router.post(
        "/apply",
        authentication(), // User must be authenticated
        authorization(["User"]), // Only Users can apply
        upload(fileValidation.files, "upload/applications").single("userCV"), // Upload CV as a file
        validation(jobValidation.addAppSchema), // Validate input data
        asyncHandler(jobService.applyForJob) // Call the service function
      );

      
// router.get(
//   "/profile/:profileId",
//   validation(userValidation.shareProfileSChema),
//   authentication(),
//   asyncHandler(userService.shareProfile)
// );
// router.patch(
//   "/profile/email",
//   validation(userValidation.updateEmailSChema),
//   authentication(),
//   asyncHandler(userService.updateEmail)
// );
// router.patch(
//   "/profile/reset_email",
//   validation(userValidation.resetEmailSChema),
//   authentication(),
//   asyncHandler(userService.resetEmail)
// );
// router.patch(
//   "/updatePassword",
//   validation(userValidation.updatePasswordSchema),
//   authentication(),
//   asyncHandler(userService.updatePassword)
// );
// router.patch("/:companyId",
//   authentication(),
//   authorization(["User"]),
//   validation(companyValidation.updateCompanySchema),
//   asyncHandler(companyService.updateCompany));

//   router.patch("/softDelete/:companyId",
//     authentication(),
//     authorization(["User","Admin"]),
    
//     asyncHandler(companyService.deleteCompany));

// router.post(
//   "/profilePicture",
//   authentication(),
//   upload(fileValidation.images,"upload/user").single("image"),
//   asyncHandler(userService.uploadImageDisk)
// )
// router.post(
//   "/multipleImages",
//   authentication(),
//   upload(fileValidation.images,"upload/user").array("images",3),
//   asyncHandler(userService. uploadMultipleImages)
// )

// router.delete(
//   "/deleteImages",
//   authentication(),
//   upload(fileValidation.images,"upload/user").single("image"),
//   asyncHandler(userService.deleteProfileImages)
// )

// router.post(
//   "/uploadCloud",
//   authentication(),
//   uploadCloud(fileValidation.images,"upload/user").single("image"),
//   asyncHandler(userService.uploadOnCloud)
// )
export default router;
