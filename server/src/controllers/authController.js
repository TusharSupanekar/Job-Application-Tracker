import User from "../models/User.js";
import bcrypt from "bcryptjs";


export const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
}



export const loginUser = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
}