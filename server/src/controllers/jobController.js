import Job from "../models/Job.js";


export const createJob = async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            user: req.userId
        });
        res.status(201).json({
            success: true,
            data: job
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating job",
            error: error.message
        });
    }
};


export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.userId });
        res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting jobs",
            error: error.message
        });
    }
};

export const getJobById = async (req,res) =>{
    try{
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.userId
        });
        if(!job){
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        res.status(200).json({
            success : true,
            data: job
        });
    } catch (error){
        res.status(500).json({
            success: false,
            message: "Error getting job by id",
            error: error.message
        });
    }
};

export const updateJob = async (req,res) =>{
    try{
        const job = await Job.findOneAndUpdate({
            _id: req.params.id,
            user: req.userId
        }, 
        req.body, { 
            new: true,
            runValidators: true
        });
        if(!job){
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        res.status(200).json({
            success : true,
            data: job
        });
    } catch (error){
        res.status(500).json({
            success: false,
            message: "Error updating job",
            error: error.message
        });
    }
};

export const deleteJob = async (req,res) =>{
    try{
        const job = await Job.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });
        if(!job){
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Job Deleted Successfully"
        });

    }catch (error){
        res.status(500).json({
            success:false,
            message: "Error Deleting job",
            error: error.message
        });
    }
};