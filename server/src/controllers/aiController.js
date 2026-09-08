import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import { analyzeResumeAgainstJob } from "../services/aiService.js";
import crypto from "crypto";

export const analyzeJob = async (req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        if (!job.jobDescription) {
            return res.status(400).json({
                success: false,
                message: "Job description is required"
            });
        }

        if (!job.resumeUsed) {
            return res.status(400).json({
                success: false,
                message: "Resume is required for analysis"
            });
        }

        const resume = await Resume.findOne({
            _id: job.resumeUsed,
            user: req.userId
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        // Create fingerprints of the current resume and job description
        const resumeHash = crypto
            .createHash("sha256")
            .update(resume.resumeText)
            .digest("hex");

        const jobDescriptionHash = crypto
            .createHash("sha256")
            .update(job.jobDescription)
            .digest("hex");

        // Return cached analysis only if nothing has changed
        if (
            job.analysis &&
            job.analysis.resumeHash === resumeHash &&
            job.analysis.jobDescriptionHash === jobDescriptionHash &&
            req.query.force !== "true"
        ) {
            return res.status(200).json({
                success: true,
                data: job.analysis,
                cached: true
            });
        }

        // Otherwise call Gemini
        const result = await analyzeResumeAgainstJob(
            resume.resumeText,
            job.jobDescription
        );

        const parsedResult = JSON.parse(result);

        // Save fresh analysis and fingerprints
        job.analysis = {
            ...parsedResult,
            analyzedAt: new Date(),
            resumeHash,
            jobDescriptionHash
        };

        await job.save();

        return res.status(200).json({
            success: true,
            data: job.analysis,
            cached: false
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error analyzing job",
            error: error.message
        });
    }
};