import express from "express";
import {createResume,getResumes, getResumeById, updateResume, deleteResume} from "../controllers/resumeController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createResume);
router.get("/", protect, getResumes);
router.get("/:id", protect, getResumeById);
router.put("/:id", protect, updateResume);
router.delete("/:id", protect, deleteResume);
export default router;