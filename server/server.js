import app from './src/app.js';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

dotenv.config();


const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
};

startServer();