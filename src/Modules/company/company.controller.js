import { Router } from "express";
import { authentication,authorization } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import * as companyService from "./company.service.js"; 
import * as companyValidation from "./company.validation.js";
import {validation} from "../../middleware/validation.middleware.js"


import { fileValidation, upload, uploadCloud } from "../../utils/file uploading/multerUpload.js";

const router = Router();
router.post("/",
   authentication(),
   authorization(["User"]),
   validation(companyValidation.addCompanySchema),
   asyncHandler(companyService.addCompany));
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
router.patch("/:companyId",
  authentication(),
  authorization(["User"]),
  validation(companyValidation.updateCompanySchema),
  asyncHandler(companyService.updateCompany));

  router.patch("/softDelete/:companyId",
    authentication(),
    authorization(["User","Admin"]),
    
    asyncHandler(companyService.deleteCompany));
    router.get("/getjobs/:companyId",
      authentication(),
      authorization(["User","Admin"]),
      
      asyncHandler(companyService.getJobs));


      router.get("/",
        authentication(),
        authorization(["User","Admin"]),
        
        asyncHandler(companyService.getCompanyWithName));



        router.post(
          "/LogoPicture/:companyId",
          authentication(),
          upload(fileValidation.images,"upload/company").single("image"),
          asyncHandler(companyService.uploadLogo)
        )

        router.post(
          "/CoverPicture/:companyId",
          authentication(),
          upload(fileValidation.images,"upload/company").single("image"),
          asyncHandler(companyService.uploadCoverPic)
        )
        

        router.delete(
          "/deleteLogo/:companyId",
          authentication(),
          
          asyncHandler(companyService.deleteLogo)
        )

        router.delete(
          "/deleteCover/:companyId",
          authentication(),
          
          asyncHandler(companyService.deleteCoverImages)
        )
        // router.post(
        //   "/coverPicture",
        //   authentication(),
        //   upload(fileValidation.images,"upload/user").single("image"),
        //   asyncHandler(userService.uploadCoverPic)
        // )
        
        
        // router.delete(
        //   "/deleteProfilePic",
        //   authentication(),
        //   upload(fileValidation.images,"upload/user").single("image"),
        //   asyncHandler(userService.deleteProfileImages)
        // )
        
        // router.delete(
        //   "/deleteCoverPic",
        //   authentication(),
        //   upload(fileValidation.images,"upload/user").single("image"),
        //   asyncHandler(userService.deleteCoverImages)
        // )
export default router;
