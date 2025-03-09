import joi from "joi";

import { generalField } from "../../middleware/validation.middleware.js";

export const createCommentSchema = joi.object(
  {
    text: joi.string().min(3).max(1000),
    file: joi.array().items(
      joi.object(generalField.fileObject)
    ),
    postId:generalField.id.required()
  }
).or("text", "file");


export const updateCommentSchema = joi.object(
  {
    text: joi.string().min(3).max(1000),
    file: joi.object(generalField.fileObject),
  
    commentId:generalField.id.required()
  }
).or("text", "file");

export const softDeleteCommentSchema = joi.object(
  {
  
  
    commentId:generalField.id.required()
  }
).required();

export const getAllCommentSchema = joi.object(
  {
  
  
    postId:generalField.id.required()
  }
).required();

export const likeAndUnlikeSchema = joi.object(
  {
  
  
    commentId:generalField.id.required()
  }
).required();


export const addReplySchema = joi.object(
  {
    text: joi.string().min(3).max(1000),
    file: joi.object(generalField.fileObject),
  postId:generalField.id.required(),
    commentId:generalField.id.required()
  }
).or("text", "file");


export const deleteCommentSchema = joi.object(
  {
    
    commentId:generalField.id.required()
  }
).required
