import mongoose, {Schema} from 'mongoose'
import jwt from "jsonwebtoken";  
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    name : {
        type : String,
        required : true,
        index : true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    designation : {
        type: String, 
        default: '',
    },
    role : {
        type: String,
        required :[true, "User role is required"],
        enum : ['user', 'admin'],
    },
    managerId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        default : ''
    },
    batch : {
        type : String,
        required : true
    }
},{timestamps:true});

//password encryption
userSchema.pre("save", async function (next) {
    
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();    
});

//checkpasswordforcorrect by defining custom methods
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

//generating token
userSchema.methods.generateToken = function(){
    return jwt.sign(
        {
            _id : this._id,  
            email : this.email, 
            name : this.username,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn : process.env.TOKEN_EXPIRY
        }
    )
};


export const User = mongoose.model('User', userSchema);
