import { Router } from "express";
import { authentication } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import * as userService from "./user.service.js"; 
import * as userValidation from "./user.validation.js";
import {validation} from "../../middleware/validation.middleware.js"
import { fileValidation, upload, uploadCloud } from "../../utils/file uploading/multerUpload.js";

const router = Router();
router.get("/profile", authentication(),asyncHandler(userService.getProfile));
router.get(
  "/profile/:profileId",
  validation(userValidation.shareProfileSChema),
  authentication(),
  asyncHandler(userService.shareProfile)
);

router.patch(
  "/updatePassword",
  validation(userValidation.updatePasswordSchema),
  authentication(),
  asyncHandler(userService.updatePassword)
);
router.patch(
  "/updateProfile",
  validation(userValidation.updateProfileSchema),
  authentication(),
  asyncHandler(userService.updateProfile)
)


router.post(
  "/profilePicture",
  authentication(),
  upload(fileValidation.images,"upload/user").single("image"),
  asyncHandler(userService.uploadProfilePic)
)

router.post(
  "/coverPicture",
  authentication(),
  upload(fileValidation.images,"upload/user").single("image"),
  asyncHandler(userService.uploadCoverPic)
)


router.delete(
  "/deleteProfilePic",
  authentication(),
  upload(fileValidation.images,"upload/user").single("image"),
  asyncHandler(userService.deleteProfileImages)
)

router.delete(
  "/deleteCoverPic",
  authentication(),
  upload(fileValidation.images,"upload/user").single("image"),
  asyncHandler(userService.deleteCoverImages)
)





router.patch(
  "/softDeleteAcc",
  
  authentication(),
  asyncHandler(userService.softDeleteAccount)
)
export default router;
