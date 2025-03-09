import { MessageModel } from "../../DB/Models/message.model.js";
import {RoomModel} from "../../DB/Models/room.model.js";
import * as dbService from "../../DB/dbService.js";

export const createRoom = async (req, res, next) => {
  const { name } = req.body;
  
  
  const Room = await dbService.create({
    model: RoomModel,
    data: {
      name,
    createdBy: req.user._id
    }
  });
  return res.status(200).json({ success: true, data: { Room } });
};


export const getAllRooms = async (req, res, next) => {
  
  
  
  const Rooms = await dbService.find({
    model: RoomModel,
    select:"name _id  "
  });
  return res.status(200).json({ success: true, data: { Rooms } });
};
export const deleteRoom = async (req, res, next) => {
  const { roomId } = req.params;

  const room = await dbService.findById({ model: RoomModel, id: roomId });

  if (!room) return next(new Error("room Not Found", { cause: 404 }));


  
  const roomOwner = room.createdBy.toString() == req.user._id.toString();


  if (!roomOwner) {
    return next(new Error("Unauthorized", { cause: 401 }));
  }

  await room.deleteOne();

  return res.status(200).json({ success: true,massege  : "room deleted successfully" });
}


export const getSingleRoom = async (req, res, next) => {
  
  
  
  const messages = await MessageModel.find({ roomId: req.params.roomId }).populate("senderId", "name"); 
  
   return res.status(200).json({ success: true, data: { messages } });
};