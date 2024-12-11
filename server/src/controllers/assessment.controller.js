import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Assessment } from "../models/assessment.model.js";

const addAssessment = asyncHandler(
    async(req, res) => {
        const { userAssessed, assessedBy, status, score } = req.body;

        if(!userAssessed || !assessedBy || !status || !score){
            throw new ApiError(400, "All data fields are required!");
        }

        if (!(["in-progress","pending"].includes(status.toLowerCase()))){
            throw new ApiError(400, "Invalid status format!! Enter any one among : pending, in-progress, finished");
        }

        const user1 = await User.findById(userAssessed);
        if (!user1){
            throw new ApiError(400, "Invalid userId !!");
        }
        
        const user2 = await User.findById(assessedBy);
        if (!user2){
            throw new ApiError(400, "Invalid userId for assesser !!");
        }

        console.log(user1._id, user2._id, req.user._id);
        if (String(user1._id) !== String(user2._id)){
            if (String(user1.managerId) !== String(user2._id)){
                throw new ApiError(401,"Only manager and the user itself can fill assessment");
            }
        }

        if(String(req.user._id) !== String(user2._id)){
            throw new ApiError(401, "current user is not authorized for this operation (login first).")
        }

        const assessment = await Assessment.create({
            userAssessed : user1._id,
            assessedBy : user2._id,
            status,
            score
        })

        if (!assessment){
            throw new ApiError(500, "Something went wrong while saving data in database.");
        }

        return res
        .status(201)
        .json(
            new ApiResponse(201, assessment, "Assessment entry created successfully in database")
        )

    }
)

const updateAssessment = asyncHandler(
    async(req, res) => {
        const { assessmentId ,  status : updatedStatus ,  score : updatedScore } = req.body;

        if(!assessmentId || !updatedStatus || !updatedScore){
            throw new ApiError(400, "All data fields are required!");
        }

        const assessment = await Assessment.findById(assessmentId);

        if(!assessment){
            throw new ApiError(404, "No assessment found with these credentails");
        }

        if(String(req.user._id) !== String(assessment.assessedBy)){
            throw new ApiError(401,"You are not authorized to update this.")
        }

        if (req.user.role.toLowerCase() === "user"){
            if (assessment.status.toLowerCase()==="finished") {
                throw new ApiError(401, "Cannot be updated now. Update time is over (Contact manager).");
            }
        }

        await Assessment.findByIdAndUpdate(assessment._id, 
            {
                status : updatedStatus,
                score : updatedScore
            }
        )

        const updatedAssessment = await Assessment.findById(assessment._id);

        if (!updateAssessment){
            throw new ApiError(500, "Something went wrong while updating data in database.");
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, updatedAssessment, "Assessment updated successfully")
        )

    }
)

export {
    addAssessment,
    updateAssessment
}