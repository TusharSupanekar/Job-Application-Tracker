import { GoogleGenAI } from "@google/genai";

export const analyzeResumeAgainstJob = async (resumeText, jobDescription) => {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });
    const response = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input: `Compare this resume against this Job description.
        
        RESUME:
        ${resumeText}
        JOB DESCRIPTION:
        ${jobDescription}
        
        Return only valid JSON in this exact structure:
        {
        "matchScore":0,
        "matchedSkills": [],
        "missingSkills": [],
        "summary": "",
        "suggestions": []
        }
        `
    });
    return response.output_text;
};