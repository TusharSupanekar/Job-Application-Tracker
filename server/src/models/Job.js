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
        enum: ["Saved", "Applied", "Interview", "Offer", "Rejected"],
        default: "Applied",
        required: true
    },
    location: {
        type: String,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, 
{ 
    timestamps: true
});

const Job = mongoose.model("Job", JobSchema);
export default Job;
