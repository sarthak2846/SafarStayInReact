import mongoose , {Schema} from "mongoose";

const userShema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
   isVerified: {
        type: Boolean,
        default: false 
    },
    otp: {
        type: String, 
        default: null
    },
    otpExpires: {
        type: Date, 
        default: null
    },
   listing:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Listing"
    }],
    booking:[{
         type:mongoose.Schema.Types.ObjectId,
        ref:"Listing"
    }]
},{timestamps:true});



const User = mongoose.model('User',userShema);

export default User;