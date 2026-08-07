import express from 'express';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from "./routes/authRoutes.js";



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);



export default app;