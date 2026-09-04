import express from "express";
import { createJob, getAllJobs, getJobById, updateJob, deleteJob, getJobStats } from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",protect, createJob);
router.get("/stats", protect, getJobStats);
router.get("/:id",protect, getJobById);
router.put("/:id",protect, updateJob);
router.delete("/:id",protect, deleteJob);
router.get("/", protect, getAllJobs);
export default router;