import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


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
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        const token =  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });


        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user:{
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
}