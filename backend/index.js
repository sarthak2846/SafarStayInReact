import express from 'express';
import 'dotenv/config';
import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.route.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import listingRouter from './routes/listing.route.js';
import bookingRouter from './routes/booking.route.js';





const app = express();
app.use(
  cors({
    origin: "https://safarstay-backend.onrender.com",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const port = process.env.PORT|| 8080;


app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/listing',listingRouter);
app.use('/api/booking',bookingRouter);


app.listen(port,()=>{
    connectDb();
    console.log(`server is running at port ${port}`);
})
