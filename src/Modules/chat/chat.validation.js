import joi from "joi";
import { generalField } from "../../middleware/validation.middleware.js";



export const createChatSchema = joi.object({
  senderId:generalField.id.required(),
  receiverId:generalField.id.required(),
  message:joi.string().min(3).max(1000).required(),
}).required()

export const getChatHistorySchema = joi.object({
  userId:generalField.id.required(),
}).required()