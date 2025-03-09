import { nanoid } from "nanoid";
import { PostModel } from "../../DB/Models/post.model.js";
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";
import * as dbService from "../../DB/dbService.js";
import { roleType } from "../../DB/Models/user.model.js";
export const createPost = async (req, res, next) => {
  const { content } = req.body;
  const allImages = [];
  let customId;
  if (req.files.length) {
    customId = nanoid();
    for (const file of req.files) {

      const results = await cloudinary.uploader.upload(
        file.path,
        { folder: `Posts/${req.user._id}/post/${customId}` }

      );
      const { public_id, secure_url } = results;
      allImages.push({ public_id, secure_url });

    }
  }
  console.log(allImages)
  const post = await dbService.create({
    model: PostModel,
    data: {
      content,
      createdBy: req.user._id,
      images: allImages,
      customId
    }
  });
  return res.status(200).json({ success: true, data: { post } });
};



export const updatePost = async (req, res, next) => {
  const { content } = req.body;
  const { postId } = req.params;
  const post = await dbService.findOne({
    model: PostModel,
    filter: { _id: postId, createdBy: req.user._id },
  });
  const allImages = [];
  if (!post) {
    return next(new Error("Post Not Found", { cause: 404 }));
  }
  if (req.files.length) {
    for (const file of req.files) {
      for (const image of post.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
        { folder: `Posts/${req.user._id}/post/${post.customId}` })
      allImages.push({ public_id, secure_url });

    }
    post.images = allImages;
  }
  post.content = content ? content : post.content;
  await post.save();
  return res.status(200).json({ success: true, data: { post } });
};



export const softDeletePost = async (req, res, next) => {

  const { postId } = req.params;
  const post = await dbService.findById({
    model: PostModel,
    id: { _id: postId },
  });

  if (!post) {
    return next(new Error("Post Not Found", { cause: 404 }));
  }
  //admin and owner of the post can make soft delete

  if (post.createdBy.toString() == req.user._id.toString() || req.user.role == roleType.Admin) {
    post.isDeleted = true;
    post.deletedBy = req.user._id;
    await post.save();
    return res.status(200).json({ success: true, data: { post } });

  }
  else {
    return next(new Error("Unauthorized", { cause: 401 }));
  }
};
export const restorePostByAdmin = async (req, res, next) => {

  const { postId } = req.params;
  if (req.user.role != roleType.Admin) {
    const post = await dbService.findOneAndUpdate({
      model: PostModel,
      filter: { _id: postId, isDeleted: true },
      data: {
        isDeleted: false,
        $unset: { deletedBy: "" }
      },
      options: { new: true }
    });
  }
  else {

  }

  return res.status(200).json({ success: true, data: { post } });

};



export const restorePost = async (req, res, next) => {

  const { postId } = req.params;
  const post = await dbService.findOneAndUpdate({
    model: PostModel,
    filter: { _id: postId, isDeleted: true, deletedBy: req.user._id },
    data: {
      isDeleted: false,
      $unset: { deletedBy: "" }
    },
    options: { new: true }
  });

  if (!post) {
    return next(new Error("Post Not Found", { cause: 404 }));
  }

  return res.status(200).json({ success: true, data: { post } });

};


export const getSinglePost = async (req, res, next) => {

  const { postId } = req.params;
  const post = await dbService.findOne({
    model: PostModel,
    filter: { _id: postId, isDeleted: false },
    populate: [
      { path: "createdBy", select: "userName image -_id" },
      //we can make a populate for comments 
      {
        path: "comments",
        select: "text image -_id",
        match: { parentComment: { $exists: false } },
        populate: [{
          path: "createdBy",
          select: "userName image -_id"
        },
        { path: "replies" }
        ]
      },
    ],

  });

  if (!post) {
    return next(new Error("Post Not Found", { cause: 404 }));
  }
  //request comments
  //const comments = await dbService.find({model:CommentModel,filter:{postId,isDeleted:false}});

  return res.status(200).json({ success: true, data: { post } });

};
export const activePosts = async (req, res, next) => {
  let posts;
  // if (req.user.role == roleType.Admin) {
  //   posts = await dbService.find({
  //      model: PostModel,
  //       filter: { isDeleted: false },
  //        populate: [{ path: "createdBy", select: "userName image -_id" }] });
  // }
  // else {
  //   posts = await dbService.find({
  //      model: PostModel,
  //       filter: { isDeleted: false, createdBy: req.user._id },
  //        populate: [{ path: "createdBy", select: "userName image -_id" }] });
  // }
  //anthor method
  // posts=await dbService.find({
  //   model:PostModel,
  //   filter:{isDeleted:false},
  //   populate:[{path:"createdBy",select:"userName image -_id"}]})
  // let resluts=[];

  // for (const post of posts) {
  //   const comments = await dbService.find({
  //     model:CommentModel,
  //     filter:{postId:post._id,isDeleted:false},
  //     select:"text image -_id"
  //   });

  //   resluts.push({post,comments});
  // }


  //query stream method احسن في ال perfomance
  // const cursor = PostModel.find({ isDeleted: false }).cursor();
  // let resluts = [];
  // for (
  //   let post = await cursor.next();
  //   post != null;
  //   post = await cursor.next()
  // ) {
  //   if (!mongoose.Types.ObjectId.isValid(post._id)) {
  //     console.error("Invalid ObjectId for post:", post._id);
  //     continue; // Skip invalid post IDs
  //   }
  //   const comments = await dbService.find({
  //     model: CommentModel,
  //     filter: { postId: post._id, isDeleted: false },
  //     select: "text image -_id"
  //   });

  //   resluts.push({ post, comments });
  // }


//pagination

  let { page } = req.query;
  
// Pagination
// limit fixed


//// page 1 ==== 5 * (1-1) = 0
//// page 2 === 5 * (2-1) = 5

// limit , skip
// limit 10 item per page
const results = await PostModel.find({ isDeleted: false }).paginate(page);

/*
20 items
limit 5 items per page
page 1 >>>> limit 5 skip 0
page 2 >>>> limit 5 skip 5
page 3 >>>> limit 5 skip 10
*/



  return res.status(200).json({ success: true, data: { results } });




}

// export const activePosts = async (req, res, next) => {
//   try {
//     let { page } = req.query;
//     page = parseInt(page) || 1; // Ensure page is a number

//     const limit = 5;
//     const skip = limit * (page - 1);

//     // Ensure correct filtering
//     const results = await PostModel.find({ isDeleted: false }).limit(limit).skip(skip);

//     return res.status(200).json({ success: true, data: { results } });
//   } catch (error) {
//     console.error("Error in activePosts:", error);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


export const freezePosts = async (req, res, next) => {
  let posts;
  if (req.user.role == roleType.Admin) {
    posts = await dbService.find({
      model: PostModel,
      filter: { isDeleted: true },
      populate: [{ path: "createdBy", select: "userName image -_id" }]
    });
  }
  else {
    posts = await dbService.find({
      model: PostModel,
      filter: { isDeleted: true, createdBy: req.user._id },
      populate: [{ path: "createdBy", select: "userName image -_id" }]
    });
  }

  return res.status(200).json({ success: true, data: { posts } });




}



/*************  ✨ Codeium Command ⭐  *************/
/**
 * Toggles the like status of a post for the authenticated user.
 *
 * Retrieves the post specified by the `postId` parameter. If the post does not exist, 
 * returns a 404 error. Checks if the authenticated user (retrieved from `req.user._id`)
 * has already liked the post. If not, the user's ID is added to the post's likes.
 * If the user has already liked the post, their ID is removed from the likes.
 * Saves the updated post and returns a 200 response with the updated post data.
 *
 * @param {Object} req - The request object containing postId in params and user ID.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 * @param {Function} next - The next middleware function in the stack.
 */

/******  3f63d3b3-723f-47fd-a81c-52f23cc67590  *******/
export const likeAndUnlike = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;
  const post = await dbService.findOne({
    model: PostModel,
    filter: { _id: postId, isDeleted: false },
  });
  if (!post) {
    return next(new Error("Post Not Found", { cause: 404 }));
  }
  const isUserLiked = post.likes.find(
    (user) => user.toString() == userId.toString()
  )
  if (!isUserLiked) {
    post.likes.push(userId);
  }
  else {
    post.likes = post.likes.filter(
      (user) => user.toString() != userId.toString()
    )
  }

  await post.save();

  return res.status(200).json({ success: true, data: { post } });
}