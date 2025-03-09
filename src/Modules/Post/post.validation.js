import joi from "joi";
import { generalField } from "../../middleware/validation.middleware.js";


export const createPostSchema = joi.object({
  content: joi.string().min(3).max(1000),
  file: joi.array().items(
    joi.object(generalField.fileObject)


  ),

}).or("content", "file");


export const updatePostSchema = joi.object({
  postId:generalField.id.required(),
  content: joi.string().min(3).max(1000),
  file: joi.array().items(
    joi.object(generalField.fileObject)


  ),

}).or("content", "file");



export const softDeletePostSchema = joi.object({
  postId:generalField.id.required(),
  
})


export const restorePostSchema = joi.object({
  postId:generalField.id.required(),
  
})

export const getSinglePostSchema = joi.object({
  postId:generalField.id.required(),
  
})

export const likeAndUnlikeSchema = joi.object({
  postId:generalField.id.required(),
  
})