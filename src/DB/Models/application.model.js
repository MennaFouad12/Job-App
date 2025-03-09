
import mongoose, { Schema, model } from "mongoose";
const applicationSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userCV: {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  status: { type: String, enum: ['pending', 'accepted', 'viewed', 'in consideration', 'rejected'], default: 'pending' }
});
applicationSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true, // We need only one user per application
});
export const ApplicationModel = mongoose.model('Application', applicationSchema);