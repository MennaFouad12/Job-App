import mongoose, { Schema, model } from "mongoose";


const companySchema = new Schema(
  {
    companyName: { type: String,unique:true, required: true },
    description: { type: String, required: true },
    industry: { type: String},
    address: { type: String},
    numberOfEmployees: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^(\d+)-(\d+)$/.test(value) && Number(value.split('-')[0]) < Number(value.split('-')[1]);
        },
        message: 'Invalid format. Use a valid range like "10-50" where the first number is smaller than the second.'
      }
    },

    companyEmail: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },

    Logo: {
      secure_url: String,
      public_id: String
    },
    coverPic: {
      secure_url: String,
      public_id: String
    },
    HRs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    deletedAt: Date,
    bannedAt: Date,
    isDeleted: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    legalAttachment: {
      secure_url: String,
      public_id: String
    },
    approvedByAdmin:{
      type: Boolean}
  },{ timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } })

  companySchema.virtual("jobs", {
    ref: "Job", // Reference to the JobModel
    localField: "_id", // Match _id of company
    foreignField: "companyId", // companyId field in JobModel
    justOne: false, // Get an array of jobs
  });
export const CompanyModel = mongoose.model.Company || model("Company", companySchema);
