
import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { foodPartnerModel } from "../models/foodpartner.model.js";

export const registerUser = async (req, res) => {
    const {name , email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({message: "Please fill all the fields"});
    }

    try {
        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({message: "User already exists"});
        }

        const hasedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hasedPassword,
        });

    if(!user) {
        return res.status(400).json({message: "Invalid user data"});
    }

  
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '30d'});

    if(!token) {
        return res.status(400).json({message: "error in generating token"});
    }

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })

    return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
     
    });

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}


export const loginUser = async (req, res) => {

    
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: "Please fill all the fields"});
    }

    const user = await User.findOne({email})

    if (!user) {
        return res.status(400).json({message: "User not found"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({message: "Invalid password"});
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '30d'});

    if(!token) {
        return res.status(400).json({message: "error in generating token"});
    }

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })

    return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
     
    });

}


export const logoutUser = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({message: "User logged out successfully"});


}





export async function registerFoodPartner(req, res) {

    const { name, email, password, phone, address, contactName } = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({
        email
    })

    if (isAccountAlreadyExists) {
        return res.status(400).json({
            message: "Food partner account already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        contactName
    })

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: "Food partner registered successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name,
            address: foodPartner.address,
            contactName: foodPartner.contactName,
            phone: foodPartner.phone
        }
    })

}

export async function loginFoodPartner(req, res) {

    const { email, password } = req.body;

    const foodPartner = await foodPartnerModel.findOne({
        email
    })

    if (!foodPartner) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: "Food partner logged in successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name
        }
    })
}

export function logoutFoodPartner(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "Food partner logged out successfully"
    });
}
