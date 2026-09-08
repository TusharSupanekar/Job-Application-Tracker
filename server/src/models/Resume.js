import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    resumeText: {
        type: String,
        required: true
    },
},
{timestamps: true}
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;