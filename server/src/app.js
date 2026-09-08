import express from 'express';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";




const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

export default app;