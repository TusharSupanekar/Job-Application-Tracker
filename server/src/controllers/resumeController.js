import Resume from "../models/Resume.js";
import mongoose from "mongoose";
import Job from "../models/Job.js";

export const createResume = async (req,res) => {
    try {
        const { name, resumeText } = req.body;

        if (!name || !resumeText) {
            return res.status(400).json({ 
                success: false,
                message: "Name and resume text are required" 
            });
        }

        const resume = await Resume.create({
            user: req.userId,
            name,
            resumeText
        });

        return res.status(201).json({
            success: true,
            data: resume,
            message: "Resume created successfully"
        })
    } catch (error) {
       return res.status(500).json({ 
            success: false,
            message: "Error creating resume" 
        });
    }
}

export const getResumes = async (req,res)=> {
    try {
        const resumes = await Resume.find({
            user: req.userId
        });

        return res.status(200).json({
            success:true,
            data: resumes,
        });

    }catch (error) {
        return res.status(500).json({
            success:false,
            message: "Error fetching resumes",
            error: error.message
        });
}
};

export const getResumeById = async (req, res) => {
   
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid resume ID"
            });
        }
        const resume = await Resume.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: resume
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error getting resume",
            error: error.message
        });
    }
};

export const updateResume = async (req, res) => {
    
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid resume ID"
            });
        }
        const { name, resumeText } = req.body;

        const resume = await Resume.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId
            },
            {
                ...(name !== undefined && { name }),
                ...(resumeText !== undefined && { resumeText })
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: resume,
            message: "Resume updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating resume",
            error: error.message
        });
    }
};

export const deleteResume = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid resume ID"
            });
        }

        const resume = await Resume.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        await Job.updateMany(
            {
                user: req.userId,
                resumeUsed: resume._id
            },
            {
                $unset: {
                    resumeUsed: "",
                    analysis: ""
                }
            }
        );

        await Resume.deleteOne({
            _id: resume._id,
            user: req.userId
        });

        return res.status(200).json({
            success: true,
            message: "Resume deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting resume",
            error: error.message
        });
    }
};