import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
   try {
    const {fullName, username, password, confirmPassword, gender} = req.body;

    console.log(req.body);

    if(password !== confirmPassword){
        return res.status(400).json({error:"Password dont match"})
    }

    const user = await User.findOne({username})

    if(user){
        return res.status(400).json({error:"User Already Exist"})
    }

    //HASH PASSWORD HERE

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // const boyProfilePic = `https://avatar-placeholder.iran.liara.run/public/boy?username=${username}`
    // const girlProfilePic = `https://avatar-placeholder.iran.liara.run/public/girl?username=${username}`

    // const boyProfilePic = `https://api.dicebear.com/6.x/male/svg?seed=${username}`;
    // const girlProfilePic = `https://api.dicebear.com/6.x/female/svg?seed=${username}`;

    const boyProfilePic = `https://api.multiavatar.com/Binx ${username}.png`;
    const girlProfilePic = `https://api.multiavatar.com/Binx ${username}.png`;


    const newUser = new User(
        {
            fullName,
            username,
            password:hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic:girlProfilePic
        }
    )

    console.log("Before generating token");
    generateTokenAndSetCookie(newUser._id, res);
    console.log("After generating token");


    await newUser.save();

    res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
    })

   } catch (error) {
        console.log("Error in SignUp Controller", error.message);
        res.status(500).json({error: "Internal Server Error"})
   }
    
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid Username or Credentials"})
        }

        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        })


    } catch (error) {
        console.log("Error in Login Controller", error.message);
        res.status(500).json({error: "Internal Server Error"})
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt","",{maxAge: 0});
        res.status(200).json({message: "Logged Out Successfully"})
    } catch (error) {
        console.log("Error in logout Controller", error.message);
        res.status(500).json({error: "Internal Server Error"})
    }
}