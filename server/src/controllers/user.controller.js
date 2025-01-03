import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import {Assessment} from "../models/assessment.model.js"
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

const generateuserToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const generatedToken = user.generateToken();
        // console.log(generatedToken);
        
        user.token = generatedToken;
        
        await user.save({validateBeforeSave : false});
        return generatedToken

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating token",error)
    }
}
//this functions checks if the token is present and if present then - is it valid? 
//then finds the user data from the token and also genererate a new token to keep the session alive for another 24 hours
const verifytoken = asyncHandler(
    async (req, res) => {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        else token = req.cookies?.token;

        if (!token){
            throw new ApiError(500,"Token was not sent properly");
        }

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select("-password")

        if (!user){
            throw new ApiError(500, "No user with this token exists")
        }

        const newToken = await generateuserToken(user._id);

        const options = {
            secure:true
        }
        
        return res
        .status(200)
        .cookie("token",  newToken , options)
        .json(
            new ApiResponse(
                200,
                user,
                "User Verified"
            )
        )
    }
)

const verifyEmail = asyncHandler(
    async (req,res)=>{
        const {email : incomingEmail} = req.body

        const user = await User.aggregate([
            {
                $match : {
                    email : incomingEmail.toLowerCase()
                }
            }
        ])

        if (user.length === 0){
            throw new ApiError(500, "User with this Email does not exist")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200,user[0]._id,"User Exists")
        )
    }
)

const registerUser = asyncHandler( 
    async (req,res) => {
    // get user details from client side
    const{ name, email, password, designation, role, managerId, batch} = req.body

    if((role.toLowerCase() === 'user' ) && (!managerId)){
        throw new ApiError(400, "Manager Id is required for users which are not admin");
    }

    const manId = ((managerId ) ? new mongoose.Types.ObjectId(managerId) : null);

    if (
        [name, email, password, designation, role, batch].some((field) => field?.trim()==="")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const ExistedUser = await User.findOne({email})

    if (ExistedUser) {
        throw new ApiError(409, "User with this email already exists")
    }

    const user = await User.create({
        name : name,
        email : email.toLowerCase(),
        password,
        designation,
        role : role.toLowerCase(),
        managerId : manId,
        batch : batch.toLowerCase().trim()
    })
    
    const createdUser = await User.findById(user._id).select(
        "-password -token"
    )

    if (!createdUser) { 
        throw new ApiError(500, "Something went wrong during user registration" )
    }

    return res.status(201)
    .json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
    
}
)

const loginUser = asyncHandler(
    async(req,res) => {
        
        const {name,email,password} = req.body;

        if (!email && !name){
            throw new ApiError(400, "Either Name or Email is required!",);
        }

        if(!password) throw new ApiError(400, "Password is required!")
    
        const user = await User.findOne({
            $or : [
                {email : email.toLowerCase()},
                {name : name}
            ]
        });
        
        if(!user){
            throw new ApiError(400, `User with this ${(name && email) ? "name or email" :( (name) ? "name" : "email")} does not exist`);
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid){
            throw new ApiError(400, "Incorrect Password");
        }

        const token = await generateuserToken(user._id);
        // console.log(token);

        const loggedInUser = await User.findById(user._id).select("-password -token");

        const options = {
            // httpOnly : true,
            secure : true
        }

        return res
        .status(200)
        .cookie("token", token, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, token
                },
                "User logged In Succesfully"
            )
        )

}
)

const logoutUser = asyncHandler(
    async(req, res) => {
        
         await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    token : 1 //we are using the unset operator here , we can also use set operator and give a value null to token but this approach is better 
                }
            },
            {
                new : true  
            }
        )

        const options = {
            // httpOnly : true,
            secure : true
        }

        return res
        .status(200)
        .clearCookie("token", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged Out Successfully"
            )
        )

    }
)

const changePasswordByCode = asyncHandler(
    async (req,res)=>{

        const { id , newPassword } = req.body

        if(!id || !newPassword){
            throw new ApiError(500, "Both Id and newPassword are required")
        }

        const user = await User.findById(id); 

        if(!user){
            throw new ApiError(500,"Invalid userId")
        }

        user.password = newPassword

        await user.save({validateBeforeSave:false});

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Password Changed Successfully"
        ))
    }
)

const changeCurrentUserPassword = asyncHandler(
    async(req,res) =>{
        const {oldPassword, newPassword} = req.body

        const user = await User.findById(req.user?._id) 
 
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if(!isPasswordCorrect){
            throw new ApiError(401, "Incorrect old password")
        }

        user.password = newPassword;

        await user.save({validateBeforeSave:false});

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Password Changed Successfully"
        ))
    }
)

const createPassword = asyncHandler(
    async (req, res) => {
        const {userId, password} = req.body;

        if(!userId){
            throw new ApiError(400, "Invalid request!")
        }

        if (!password){
            throw new ApiError(400, "Password is required")
        }

        const user = await User.findById(userId);
        
        if(!user) throw new ApiError(404, "User with this Id does not exist")

        if (user.passwordCreated === true) throw new ApiError(400,"Password already Created.")

        user.password = password;
        user.passwordCreated = true;

        await user.save({validateBeforeSave:false});

        return res
        .status(200)
        .json(
            new ApiResponse(200,{},"Password created successfully" )
        )
    }
)

const getUsers = asyncHandler(
    async(req, res) => {
        const { batch, managerId, userId, role, designation, email} = req.query;

        const query = {};

        if(batch) query.batch = String(batch)
        if(managerId) query.managerId = new mongoose.Types.ObjectId(managerId); 
        if(userId) query._id = new mongoose.Types.ObjectId(userId); 
        if(role) query.role = String(role).toLowerCase();
        if(designation) query.designation = designation;
        if(email) query.email = email.toLowerCase();
        // console.log(query);

        const users = await User.aggregate([
            {
                $match : query
            },
            {
                $lookup: {
                    from: "assessments",
                    localField: "_id",
                    foreignField: "userAssessed",
                    as: "assessments"
                }
            },
            {
                $addFields: {
                    "selfAssessment": {
                        $filter: {
                            input: "$assessments",
                            as: "assessment",
                            cond: { 
                                $and: [
                                    { $eq: ["$$assessment.assessedBy", "$_id"] },
                                    { $eq: ["$$assessment.userAssessed", "$_id"] }
                                ]
                             }
                        }
                    },
                    "managerAssessment": {
                        $filter: {
                            input: "$assessments",
                            as: "assessment",
                            cond: {
                                $and: [
                                    { $eq: ["$$assessment.assessedBy", "$managerId"] },
                                    { $eq: ["$$assessment.userAssessed", "$_id"] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project : {
                    assessments: 0,
                    password : 0,
                    token : 0,
                }
            }
        ])
        // console.log(users);
        

        if (users.length === 0){
            throw new ApiError(400, "No users with given credentials exist")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, users, "Users fetched successfully")
        ) 
    }
)

const getCurrentUser = asyncHandler(
    async(req,res) => {

        const user = await User.aggregate([
            {
                $match : {
                    _id : req.user._id
                }
            },
            {
                $project : {
                    password : 0,
                    token : 0
                }
            }
        ])

        if (user.length === 0){
            throw new ApiError(500, "Something went wrong")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
            200,
            user[0],
            "Current User fetched Successfully"
        ));
    }
)

const getBatches = asyncHandler(
    async(req, res) => {
        const {all} = req.query;
        let query = {};

        if (all === "false"){
            query.managerId = new mongoose.Types.ObjectId(req.user._id)
        }

        if ((req.user.role !== "admin") && (req.user.role !== "super-admin")){
            throw new ApiError(401, "Not authorized. Login as a manager or admin first.")
        }

        // console.log(query);        
        const batches = await User.aggregate([
            {
                $match: query
            },
            {
                $group: {
                    _id: null,
                    batches: { $addToSet: "$batch" }
                }
            },
            {
                $project: {
                    _id: 0,
                    batches: 1
                }
            }
        ])
        // console.log(batches);
        

        if(!batches.length){
            throw new ApiError(404, "No batches found under this manager")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, batches[0], "Fetched Successfully" )
        )

    }
)

const deleteUser = asyncHandler(
    async(req, res) => {
        const {userId} = req.body;

        if (!userId) { 
            throw new ApiError(400, "UserId is required")
        }
        
        const user = await User.findById(userId);
        
        if (!user) { 
            throw new ApiError(500, "User not found in database")
        }

        if ((String(user._id)!==String(req.user._id)) && (String(user._id)!==String(req.user.managerId))){
            throw new ApiError(401, "Not authorized for this operation. (Only the user itself or its manager can delete it)");
        }

        const assessmentDeletion = await Assessment.deleteMany({
            $or :[{userAssessed : new mongoose.Types.ObjectId(userId)}, { assessedBy : new mongoose.Types.ObjectId(userId) }]
        })

        if (!assessmentDeletion){
            throw new ApiError(500, "Something went wrong while deleting user data")
        }

        const userDeletion = await User.findByIdAndDelete(userId);

        if (!userDeletion){
            throw new ApiError(500, "Something went wrong while deleting user profile")
        }

        const options = {
            // httpOnly : true,
            secure : true
        }

        return res
        .status(200)
        .clearCookie("token", options)
        .json( 
            new ApiResponse(204, {}, "User deleted successfully")
        )
    }
)

export {
    verifytoken,
    verifyEmail,
    registerUser,
    loginUser,
    logoutUser,
    getUsers,
    getCurrentUser,
    getBatches,
    changePasswordByCode,
    createPassword,
    changeCurrentUserPassword,
    deleteUser
}