import { nanoid } from "nanoid";
import * as dbService from "../../DB/dbService.js";
import { CommentModel } from "../../DB/Models/comment.model.js";
import { PostModel } from "../../DB/Models/post.model.js";
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";
import { roleType } from "../../DB/Models/user.model.js";


export const createComment = async (req, res, next) => {
  const { comment } = req.body;
  const { postId } = req.params;
  let image;
  const post = await dbService.findById({ model: PostModel, id: postId });

  if (!post) return next(new Error("Post Not Found", { cause: 404 }));
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
      { folder: `Posts/${post.createdBy}/post/${post.customId}/comments` });
    image = { secure_url, public_id };
  }

  const newComment = await dbService.create({
    model: CommentModel,
    data: { comment, createdBy: req.user._id, postId: post._id, image }
  });

  await post.save();
  return res.status(200).json({ success: true, data: { newComment } });
}

export const updateComment = async (req, res, next) => {
  const { text } = req.body;
  const { commentId } = req.params;
  let image;
  const comment = await dbService.findById({ model: CommentModel, id: commentId });

  if (!comment) return next(new Error("Post Not Found", { cause: 404 }));

  const post = await dbService.findOne({ model: PostModel, filter: { _id: findcomment.postId, isDeleted: false } });
  if (!post) return next(new Error("Post Not Found", { cause: 404 }));
  if (comment.createdBy.toString() != req.user._id.toString()) return next(new Error("Unauthorized", { cause: 401 }));
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
      { folder: `Posts/${post.createdBy}/post/${post.customId}/comments` });
    image = { secure_url, public_id };
    if (comment.image) {
      await cloudinary.uploader.destroy(comment.image.public_id);
    }
    comment.image = image;
  }
  comment.text = text ? text : comment.text;
  await comment.save();

  return res.status(200).json({ success: true, data: { comment } });
}


export const softDeleteComment = async (req, res, next) => {

  const { commentId } = req.params;
  let image;
  const comment = await dbService.findById({ model: CommentModel, id: commentId });

  if (!comment) return next(new Error("Post Not Found", { cause: 404 }));

  const post = await dbService.findOne({ model: PostModel, filter: { _id: findcomment.postId, isDeleted: false } });
  if (!post) return next(new Error("Post Not Found", { cause: 404 }));
  //user who created the comment can make soft delete
  const commentOwner = comment.createdBy.toString() == req.user._id.toString();
//user who created the post can make soft delete
  const postOwner = post.createdBy.toString() == req.user._id.toString();
  //admin can make soft delete
  const admin = req.user.role == roleType.Admin;

  if (!commentOwner || !postOwner || !admin) {
    return next(new Error("Unauthorized", { cause: 401 }));
  }
  comment.isDeleted = true;
  comment.deletedBy = req.user._id;
  await comment.save();
  return res.status(200).json({ success: true, data: { comment } });
}



export const getAllComments = async (req, res, next) => {

  const { postId } = req.params;
  const post = await dbService.findOne({ model: PostModel,
     filter: { _id: postId, isDeleted: false } });

  if (!post) return next(new Error("Post Not Found", { cause: 404 }));
  const comments = await dbService.find({ model: CommentModel, 
    filter: { postId, isDeleted: false , parentComment: null },
  populate:[{path:"replies"}] });

    
  return res.status(200).json({ success: true, data: { comments } });
}
export const likeAndUnlikeComment = async (req, res, next) => {
  const { commentId } = req.params;
  const userId = req.user._id;
  const comment = await dbService.findOne({
    model: CommentModel,
    filter: { _id: commentId, isDeleted: false },
  });
  if (!comment) {
    return next(new Error("Post Not Found", { cause: 404 }));
  }
  const isUserLiked = comment.likes.find(
    (user) => user.toString() == userId.toString()
  )
  if (!isUserLiked) {
    comment.likes.push(userId);
  }
  else {
    comment.likes = comment.likes.filter(
      (user) => user.toString() != userId.toString()
    )
  }

  await comment.save();

  return res.status(200).json({ success: true, data: {  comment } });
}


export const addReply = async (req, res, next) => {
  const { postId, commentId } = req.params;
  //parent comment اللي انا همل ريبلاي عليه
  const comment = await dbService.findOne({
    model: CommentModel,
    filter: { _id: commentId, isDeleted: false },
  });
  if (!comment) {
    return next(new Error("Post Not Found", { cause: 404 }));
  }
  const post = await dbService.findOne({
     model: PostModel,
    filter: { _id: postId, isDeleted: false } });

 if (!post) return next(new Error("Post Not Found", { cause: 404 }));

 let image;
 
 if (req.file) {
   const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
     { folder: `Posts/${post.createdBy}/post/${post.customId}/comments/${comment._id}` });
   image = { secure_url, public_id };
 }

 const reply = await dbService.create({
   model: CommentModel,
   data: { ...req.body,
     createdBy: req.user._id,
      postId: post._id,
       image,
        parentComment: comment._id
       }
 });


  return res.status(200).json({ success: true, data: {  reply } });
}

export const deleteComment = async (req, res, next) => {
  const { commentId } = req.params;
  let image;
  const comment = await dbService.findById({ model: CommentModel, id: commentId });

  if (!comment) return next(new Error("Post Not Found", { cause: 404 }));

  const post = await dbService.findOne({ model: PostModel, filter: { _id: findcomment.postId, isDeleted: false } });
  if (!post) return next(new Error("Post Not Found", { cause: 404 }));
  //user who created the comment can make soft delete
  const commentOwner = comment.createdBy.toString() == req.user._id.toString();
//user who created the post can make soft delete
  const postOwner = post.createdBy.toString() == req.user._id.toString();
  //admin can make soft delete
  const admin = req.user.role == roleType.Admin;

  if (!commentOwner || !postOwner || !admin) {
    return next(new Error("Unauthorized", { cause: 401 }));
  }

//delete all nested replaies

await comment.deleteOne(); //delete parent comment

  return res.status(200).json({ success: true,massege  : "comment deleted successfully" });
}


