import Resume from "../models/Resume.js";

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