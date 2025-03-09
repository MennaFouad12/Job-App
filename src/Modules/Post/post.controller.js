import { Router } from "express";
import * as postService from "./post.service.js";
import * as postValidation from "./post.validation.js";
import {authorization, authentication } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import {  uploadCloud } from "../../utils/file uploading/multerUpload.js"; //upload
import {validation} from "../../middleware/validation.middleware.js"
import commentRouter from "../Comment/comment.controller.js";
const router = Router();
router.use("/:postId/comment", commentRouter);


router.post("/createPost", 
   authentication(),
   authorization(["User"]),
   uploadCloud().array("images",5),//uploadCloud must come before validation because multer parse the body form data (as express.json it parse the body raw data)
   validation(postValidation.createPostSchema), 
   asyncHandler(postService.createPost));


   router.patch("/update/:postId", 
    authentication(),
    authorization(["User"]),
    uploadCloud().array("images",5),//uploadCloud must come before validation because multer parse the body form data (as express.json it parse the body raw data)
    validation(postValidation.updatePostSchema), 
    asyncHandler(postService.updatePost));

    router.patch("/softDelete/:postId", 
      authentication(),
      authorization(["User","Admin"]),
      validation(postValidation.softDeletePostSchema), 
      asyncHandler(postService.softDeletePost));

      router.patch("/restorePost/:postId", 
        authentication(),
        authorization(["User","Admin"]),
        validation(postValidation.restorePostSchema), 
        asyncHandler(postService.restorePost));


        
      

        router.get("/activePosts", 
          authentication(),
          authorization(["User","Admin"]),
          // validation(postValidation.getSinglePostSchema), 
          asyncHandler(postService.activePosts));

          router.get("/:postId", 
            authentication(),
            authorization(["User","Admin"]),
            // validation(postValidation.getSinglePostSchema), 
            asyncHandler(postService.getSinglePost));

        router.get("/freezedPosts", 
          authentication(),
          authorization(["User","Admin"]),
          // validation(postValidation.getSinglePostSchema), 
          asyncHandler(postService.freezePosts));
          
        router.patch("/like_unlike/:postId", 
          authentication(),
          authorization(["User"]),
          validation(postValidation.likeAndUnlikeSchema), 
          asyncHandler(postService.likeAndUnlike));


export default router;
