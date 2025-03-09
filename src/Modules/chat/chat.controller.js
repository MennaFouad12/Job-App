import { Router } from "express";
import { authentication,authorization } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import * as chatService from "./chat.service.js"; 
import * as chatValidation from "./chat.validation.js";
import {validation} from "../../middleware/validation.middleware.js"
import { fileValidation, upload, uploadCloud } from "../../utils/file uploading/multerUpload.js";

const router = Router();

router.post(
  "/",
  authentication(), // User must be authenticated
  authorization(["User"]), // Only Users can apply

  validation(chatValidation.createChatSchema), // Validate input data
  asyncHandler(chatService.createChat) // Call the service function
);
router.get(
  "/:userId",
  authentication(), // User must be authenticated
  authorization(["User"]), // Only Users can apply

  validation(chatValidation.getChatHistorySchema), // Validate input data
  asyncHandler(chatService.getChatHistory) // Call the service function
);

export default router;