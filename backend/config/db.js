import mongoose from "mongoose";
import 'dotenv/config';


const url = process.env.MONGODB_URI;

const connectDb = async ()=>{

    try
    {
       await mongoose.connect(url);
       console.log("database connected ...............");
    }
    catch(error)
    {
        console.log('db error',error);
    }
}

export default connectDb;