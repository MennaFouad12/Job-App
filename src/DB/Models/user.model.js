import mongoose, { Schema, model } from "mongoose";
import moment from "moment";
import bcrypt from "bcrypt";
import { hash } from "../../utils/hashing/hash.js";

export const genderType = {
  male: "male",
  female: "female",
};
export const roleType = {
  User: "User",
  Admin: "Admin",
};
export const providersType = {
  System: "System",
  Google: "Google",
};
export const defaultImage="upload\default-avatar-icon-of-social-media-user-vector.jpg"
const userSchema = new Schema(
  {

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    providers: {
      type: String,
      enum: Object.values(providersType),
      default: providersType.System,
    },
    phone: String,
    address: String,
    DOB: { 
      type: Date, 
      
      validate: {
          validator: function(value) {
              return value < new Date(); // DOB must be before today
          },
          message: 'Date of birth must be in the past.'
      }
  },
    // image: {
    //   type: String,
    //   default: defaultImage,
    // },
    profilePic:{
secure_url: String,
public_id: String
    },
    coverPic:{
      secure_url: String,
      public_id: String
          },
    gender: {
      type: String,
      enum: Object.values(genderType),
      default: genderType.male,
    },
    role: {
      type: String,
      enum: Object.values(roleType),
      default: roleType.User,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    bannedAt: Date,
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },

    changedCredentialsTime: Date,
    otp: [{
      code: { type: String }, // Hashed OTP
      type: { type: String, enum: ['confirmEmail', 'forgetPassword'], required: true },
      expiresIn: { type: Date, required: true }
  }],
    
    // tempEmail:String,
    // tempEmailOTP:String,
  },
  { timestamps: true, toJSON: { virtuals: true },
  toObject: { virtuals: true } }
);
userSchema.virtual('username').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.virtual('age').get(function () {
  return moment().diff(this.DOB, 'years'); // Calculate age in years
});

// Pre-save validation to ensure user is at least 18 years old
//Pre-save (hook) that runs before saving a document to the database.
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await hash({ plainText: this.password });
  }
  // Encrypt mobileNumber (example using simple encryption)
  if (this.isModified("phone")) {
    this.plainPhone = this.phone; // Save the original phone
    this.phone = await bcrypt.hash(this.phone, 10); // Encrypt the phone number
  }
  if (this.DOB) {
    const age = moment().diff(moment(this.DOB), 'years');
    if (age < 18) {
      return next(new Error('User must be at least 18 years old.'));
    }
  } else if (this.isNew) {
    // Only require DOB for new users, not for updates
    return next(new Error('Date of Birth is required.'));
  }
  
  next();
})
export const UserModel = mongoose.model.User || model("User", userSchema);
