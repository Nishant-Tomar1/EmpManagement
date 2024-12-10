import { asyncHandler } from "../utils/asyncHandler";
import {ApiError} from "../utils/ApiError";
import {ApiResponse} from "../utils/ApiResponse"
import User from "../models/user.model.js"

const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const token = user.generateToken();
        return token

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating token")
    }
}

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
        
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User Verified "
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
            throw new ApiError(500, "User with this Email doesn't exist")
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
    // get user details from frontend 
    const{ name, email, password, designation, role, managerId, batch} = req.body

    // validation -not empty
    if (
        [name, email, password, designation, role, managerId, batch].some((field) => field?.trim()==="")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exists : email
    const ExistedUser = await User.findOne({email})

    if (ExistedUser) {
        throw new ApiError(409, "User with this email already exists")
    }


    // create user object - create entry in db 
    const user = await User.create({
        name : name,
        email : email.toLowerCase(),
        password,
        designation,
        role,
        managerId,
        batch
    })

    // remove password from response
    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    // check for user creation
    if (!createdUser) { 
        throw new ApiError(500, "Something went wrong during user registration" )
    }

    // console.log("User Registered Successfully!!");

    // return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
    
}
)

const loginUser = asyncHandler(
    async(req,res) => {
        
        const {email,password} = req.body;

        if (!email){
            throw new ApiError(400, "Email is required",);
        }

        const user = await User.findOne({email})

        if(!user){
            throw new ApiError(400, "User doesn't exist");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid){
            throw new ApiError(400, "Incorrect Password");
        }

        const token = await generateToken(user._id);

        const loggedInUser = await User.findById(user._id).select("-password");

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

const getUserById = asyncHandler(
    async(req, res) => {
        const {id :userId} = req.params;

        if(!userId){
            throw new ApiError(500, "UserId is required")
        }

        const user = await User.aggregate([
            {
                $match : {
                    _id : new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $project : {
                    password : 0,
                    token : 0,
                }
            }
        ])

        if (user.length === 0){
            throw new ApiError(400, "User with this Id doesn't exist")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, user[0], "User fetched successfully")
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

export {
    verifytoken,
    verifyEmail,
    registerUser,
    loginUser,
    logoutUser,
    getUserById,
    getCurrentUser,
    changePasswordByCode,
    changeCurrentUserPassword,
}