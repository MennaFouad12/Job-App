import { ChatModel } from "../../DB/Models/chat.model.js";
export const createChat = async (req, res, next) => {
  const { senderId, receiverId, message } = req.body;
  let newChat;
if(!senderId || !receiverId || !message){
  return next(new Error("All fields are required", { cause: 400 }));
}
  const chat = await ChatModel.findOne({ $or: [{ senderId, receiverId }, { senderId: receiverId, receiverId: senderId }] });
  if (chat) {
    chat.messages.push({ message, senderId });
    await chat.save();
  } else {
    newChat= await ChatModel.create({ senderId, receiverId, messages: [{ message, senderId }] });
  }
  res.status(201).json({ success: true, message: "Message sent successfully" ,newChat});

}
export const getChatHistory = async (req, res, next) => {

    const { userId } = req.params; // The user you want to see chat history with
    const currentUserId = req.user._id; // Authenticated user making the request

    const chat = await ChatModel.findOne({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    });

    if (!chat) {
      return res.status(404).json({ success: false, message: "No chat history found" });
    }

    res.status(200).json({ success: true, data: chat.messages });
  
};
