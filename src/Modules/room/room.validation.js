import joi from "joi";
import { generalField } from "../../middleware/validation.middleware.js";

export const createRoomSchema= joi.object({
  name: joi.string().min(3).max(1000)})





    export const deleteRoomSchema = joi.object({
      roomId:generalField.id.required(),
      
    })

    
    export const getSingleRoomSchema = joi.object({
      roomId:generalField.id.required(),
      
    })

    