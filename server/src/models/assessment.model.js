import mongoose, {Schema} from "mongoose";

const assessmentSchema = new Schema({
    userAssessed : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    assessedBy : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    status : {
        type : String,
        enum : ["finished","In progress","pending"]
    },
    score : {
        type : mongoose.Schema.Types.Mixed
    }
},{timestamps:true});