import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true},
    role: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            "Saved",
            "Applied",
            "Interview",
            "Offer",
            "Rejected",
            "Withdrawn"
        ],
        default: "Applied"
    },
    location: {
        type: String,
    },
    jobUrl: {
        type: String,
    },
    applicationDate: {
        type: Date,
        default: Date.now
    },
    notes:{
        type: String,
    },
    workType:{
        type:String,
        enum: ["Remote", "Hybrid", "On-site"],
    },
    source:{
        type: String,
        enum: ["LinkedIn", "Indeed", "Glassdoor", "Company Website", "Referral", "Other"],
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    jobDescription:{
        type: String,
    },
    resumeUsed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume"
    },
    analysis: {
        matchScore: Number,
        matchedSkills: [String],
        missingSkills: [String],
        summary: String,
        suggestions: [String],
        analyzedAt: Date,

        resumeHash: String,
        jobDescriptionHash: String
    }
}, 
{ 
    timestamps: true
});

const Job = mongoose.model("Job", JobSchema);
export default Job;
