import express from "express";
import {createResume,getResumes} from "../controllers/resumeController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createResume);
router.get("/", protect, getResumes);
export default router;