import { User }  from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(
    async (req , _ , next) => {
        try {
            const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer","") 
            // console.log(token);
                       
            if (!token) {
                throw new ApiError(401, "Unauthorized request")
            }
            
            //decoding token
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
               
            const user = await User.findById(decodedToken?._id).select("-password");
    
            if (!user) { 
                throw new ApiError(401,"Session Expired! Login Again");
            }
    
            req.user = user;
            next()
            
        } catch (error) {
            throw new ApiError(404, "Login Again (session expired)!")
        }

    }
)
