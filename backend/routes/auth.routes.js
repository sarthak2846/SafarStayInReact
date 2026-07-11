import express from 'express';
import { Router } from 'express';
import { logIn, logOut, requestVerificationOtp, resendOtp, signUp, verifyOtp } from '../controllers/auth.controller.js';

const authRouter = Router();


authRouter.post('/signup',signUp)
authRouter.post('/login',logIn)
authRouter.post("/logout",logOut)

// otp protion routes

authRouter.post('/verify-otp', verifyOtp);
authRouter.post('/resend-otp', resendOtp);
authRouter.post('/request-verification', requestVerificationOtp);



export default authRouter;