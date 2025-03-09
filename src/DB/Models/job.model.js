
import mongoose, { Schema, model } from "mongoose";
const jobOpportunitySchema = new Schema({
  jobTitle: {
    type: String,
    required: true,
    
  },
  jobLocation: {
    type: String,
    enum: ['onsite', 'remotely', 'hybrid'],
  
  },
  workingTime: {
    type: String,
    enum: ['part-time', 'full-time'],
    required: true
  },
  seniorityLevel: {
    type: String,
    enum: ['fresh', 'Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'],
    required: true
  },
  jobDescription: {
    type: String,
    
  },
  technicalSkills: {
    type: [String],
    
  },
  softSkills: {
    type: [String],
    
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  closed: {
    type: Boolean,
    default: false
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  }
}, { timestamps: true });

export const JobModel = mongoose.model('Job', jobOpportunitySchema);