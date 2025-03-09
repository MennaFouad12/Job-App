import { Server } from "socket.io";

// import { addUserToRoom , removeUserFromRoom} from "../../DB/Models/room.model.js";
// import { MessageModel } from "../../DB/Models/message.model.js";
import mongoose from "mongoose";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
  
    // Join Room
    // socket.on("joinRoom", async ({ roomId, userId }) => {
    //   socket.join(roomId);
    //   await addUserToRoom(roomId, userId);
      
    //   io.to(roomId).emit("message", { message: `User ${userId} has joined the chat` });
    // });
  
    // // Send Message
    // socket.on("sendMessage", async ({ roomId, userId, content }) => {
    //   const objectIdUser = new mongoose.Types.ObjectId(userId);
    //   const message = new MessageModel({ roomId, senderId: objectIdUser, content });
    //   await message.save();
      
    //   io.to(roomId).emit("message", { sender: `User ${userId}`, content });
    // });
  
    // // Leave Room
    // socket.on("leaveRoom", async ({ roomId, userId }) => {
    //   socket.leave(roomId);
    //   await removeUserFromRoom(roomId, userId);
      
    //   io.to(roomId).emit("message", { message: `User ${userId} has left the chat` });
    // });
  
    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
export const emitNewApplication = (hrId, applicationData) => {
  if (io) {
    io.to(hrId).emit("newApplication", applicationData); 
  }
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
