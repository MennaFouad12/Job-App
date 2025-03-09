import { Router } from "express";
import * as commentService from "./comment.service.js";

import * as commentValidation from "./comment.validation.js";
import {authorization, authentication } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import {  uploadCloud } from "../../utils/file uploading/multerUpload.js"; //upload
import {validation} from "../../middleware/validation.middleware.js"
const router = Router({mergeParams: true});//mergeParams: true is used to merge the params of the parent router with the params of the child router



router.post("/", 
  authentication(),
  authorization(["User"]),
  uploadCloud().single("image"),//uploadCloud must come before validation because multer parse the body form data (as express.json it parse the body raw data)
  validation(commentValidation.createCommentSchema), 
  asyncHandler(commentService.createComment));


  router.patch("/:commentId", 
    authentication(),
    authorization(["User"]),
    uploadCloud().single("image"),//uploadCloud must come before validation because multer parse the body form data (as express.json it parse the body raw data)
    validation(commentValidation.updateCommentSchema), 
    asyncHandler(commentService.updateComment));



    router.patch("/softDelete/:commentId", 
      authentication(),
      authorization(["User","Admin"]),
      
      validation(commentValidation.softDeleteCommentSchema), 
      asyncHandler(commentService.softDeleteComment));
    
  //merge param
  // post/:postId/comment
      router.get("/:commentId", 
        authentication(),
        authorization(["User","Admin"]),
        validation(commentValidation.getAllCommentSchema), 
        asyncHandler(commentService.getAllComments));



        router.patch("/like_unlike/:commentId", 
          authentication(),
          authorization(["User"]),
          validation(commentValidation.likeAndUnlikeSchema), 
          asyncHandler(commentService.likeAndUnlikeComment));
//add reply with merge param
// /:commentId/reply 
          router.post("/:commentId", 
            authentication(),
            authorization(["User"]),
            uploadCloud().single("image"),
            validation(commentValidation.addReplySchema), 
            asyncHandler(commentService.addReply));

            router.delete("/:commentId", 
              authentication(),
              authorization(["User","Admin"]),
              validation(commentValidation.deleteCommentSchema),
              asyncHandler(commentService.deleteComment)
            )
          

export default router;
