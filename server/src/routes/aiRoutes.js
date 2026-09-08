import express from 'express';
import {analyzeJob} from "../controllers/aiController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze-job/:id", protect, analyzeJob);

export default router;