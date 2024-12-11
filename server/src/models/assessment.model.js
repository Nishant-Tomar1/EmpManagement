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
        enum : ["finished","in-progress"]
    },
    score : {
        type : mongoose.Schema.Types.Mixed
    }
},{timestamps:true});

export const Assessment = mongoose.model('Assessment',assessmentSchema);