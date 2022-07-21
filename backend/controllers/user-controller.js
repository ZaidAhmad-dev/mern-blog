import User from '../model/User.js';
import bcrypt from "bcryptjs"

export const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        console.log(err);
    }
    if(!users){
        return res.status(404).json({message: "No users found"});
    }
    return res.status(200).json({users});
}

export const signup = async (req, res, next) => {
    const {name, email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email});
    } catch (err) {
        console.log(err);
    }

    if(existingUser){
        return res.status(409).json({message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let newUser = new User({
        name,
        email,
        password: hashedPassword,
        blogs: []
    });

    try {
        newUser = await newUser.save();
    } catch (err) {
        console.log(err);
    }

    if(!newUser){
        return res.status(500).json({message: "Something went wrong"});
    }

    return res.status(201).json({newUser});

}

export const login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email});
    } catch (err) {
        console.log(err);
    }

    if(!existingUser){
        return res.status(401).json({message: "Invalid email or password"});
    }

    const isValidPassword = await bcrypt.compare(password, existingUser.password);

    if(!isValidPassword){
        return res.status(401).json({message: "Invalid email or password"});
    }

    return res.status(200).json({existingUser});
}