import User from "../model/user.model.js";
import bcrypt from 'bcrypt';
import getToken from "../config/token.js";
import jwt from 'jsonwebtoken';
import apiInstance from "../config/nodeMailer.js";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;


    let existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now


    let user = await User.create({
      name,
      email,
      password: hashPassword,
      otp,
      otpExpires,
      isVerified: false
    });

 await apiInstance.transactionalEmails.sendTransacEmail({
  sender: { email: "sarthaksingh20205@gmail.com", name: "SafarStay" }, 
  to: [{ email: user.email }],
  subject: "OTP VERIFICATION",
  htmlContent: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
      <!-- Header / Logo Area -->
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #333333; margin: 0; font-size: 24px; font-weight: 600;">SafarStay</h2>
        <p style="color: #666666; font-size: 14px; margin-top: 4px;">Account Verification</p>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #eeeeee; margin-bottom: 24px;" />
      
      <!-- Body Content -->
      <p style="color: #444444; font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">
        Hello,
      </p>
      <p style="color: #444444; font-size: 16px; line-height: 1.5; margin: 0 0 24px 0;">
        Thank you for registering! Please use the following One-Time Password (OTP) to complete your verification process. This code is active for <strong>5 minutes</strong>.
      </p>
      
      <!-- OTP Box -->
      <div style="text-align: center; background-color: #f4f6f9; border-radius: 6px; padding: 16px; margin-bottom: 24px; letter-spacing: 4px;">
        <span style="font-size: 32px; font-weight: 700; color: #1e3a8a; font-family: monospace;">${otp}</span>
      </div>
      
      <p style="color: #ff3b30; font-size: 13px; text-align: center; margin: 0 0 24px 0;">
        ⚠️ For security reasons, do not share this code with anyone.
      </p>
      
      <hr style="border: 0; border-top: 1px solid #eeeeee; margin-bottom: 16px;" />
      
      <!-- Footer -->
      <p style="color: #999999; font-size: 12px; text-align: center; margin: 0;">
        If you didn't request this email, you can safely ignore it.
      </p>
    </div>
  `
});
 

    
    const verifyToken = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

   
    res.cookie("verifyToken", verifyToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 5 * 60 * 1000 
    });

    return res.status(200).json({ 
     message: "OTP sent to user email. Please verify." 
    });

  } catch (error) {
    return res.status(500).json({  message: `Signup error: ${error.message}` });
  }
};

// user entered the otp which verified in this route
export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    
    const verifyToken = req.cookies.verifyToken;
    if (!verifyToken) {
      return res.status(400).json({ 
        message: "Verification session expired" 
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(verifyToken, process.env.JWT_SECRET);
    } 
    catch (err)
     {
      return res.status(401).json({ 
        message: "Invalid or tampered verification session. Please sign up again." 
      });
    }


    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (Date.now() > new Date(user.otpExpires).getTime()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new code." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code. Please try again." });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.clearCookie("verifyToken");

    const token = await getToken(user._id); 
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    const userData = user.toObject();
    delete userData.password;

   
    return res.status(200).json({
       userData
    });

  } 
  catch (error)
   {
    return res.status(500).json({ message: `Verification error: ${error.message}` });
  }
};



export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    
   
    let user = await User.findOne({ email }).populate("listing", "title image1 image2 image3 description rent category city landmark host geometry");
    if (!user) {
      return res.status(400).json({ message: "User is not registered" });
    }

   
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Username or Password" });
    }

    
    if (!user.isVerified) {
      return res.status(403).json({ message: "verify your email" });
    }

    
    let token = await getToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

   
    const userData = user.toObject();
    delete userData.password;
    
    return res.status(200).json(userData);

  } 
  catch (error) 
  {
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }

};


export const logOut = async (req,res)=>{
    try
    {
      res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
       return res.status(200).json({message:'logout successfully'})
    }
    catch(error)
    {
     
    return res.status(500).json({message:`logout error ${error}`});

    }
}

// resend the otp 
export const resendOtp = async (req, res) => {

  try {
    
    const verifyToken = req.cookies.verifyToken;
    if (!verifyToken) {
      return res.status(400).json({ 
        message: "Verification session expired" 
      });
    }


    let decoded;
    try {
      decoded = jwt.verify(verifyToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ 
        message: "Invalid or tampered session. Please go to verify User for otp Verification" 
      });
    }

    const userId = decoded.userId;

  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    
    if (user.isVerified) {
      return res.status(400).json({ message: "Account is already verified. Please log in." });
    }


    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtpExpires = new Date(Date.now() + 5 * 60 * 1000); 

    
    user.otp = newOtp;
    user.otpExpires = newOtpExpires;
    await user.save();


 
  await apiInstance.transactionalEmails.sendTransacEmail({
  sender: { email: "sarthaksingh20205@gmail.com", name: "SafarStay" }, 
  to: [{ email: user.email }],
  subject: "OTP VERIFICATION",
  htmlContent: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
      <!-- Header / Logo Area -->
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #333333; margin: 0; font-size: 24px; font-weight: 600;">SafarStay</h2>
        <p style="color: #666666; font-size: 14px; margin-top: 4px;">Account Verification</p>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #eeeeee; margin-bottom: 24px;" />
      
      <!-- Body Content -->
      <p style="color: #444444; font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">
        Hello,
      </p>
      <p style="color: #444444; font-size: 16px; line-height: 1.5; margin: 0 0 24px 0;">
        Thank you for registering! Please use the following One-Time Password (OTP) to complete your verification process. This code is active for <strong>5 minutes</strong>.
      </p>
      
      <!-- OTP Box -->
      <div style="text-align: center; background-color: #f4f6f9; border-radius: 6px; padding: 16px; margin-bottom: 24px; letter-spacing: 4px;">
        <span style="font-size: 32px; font-weight: 700; color: #1e3a8a; font-family: monospace;">${newOtp}</span>
      </div>
      
      <p style="color: #ff3b30; font-size: 13px; text-align: center; margin: 0 0 24px 0;">
        ⚠️ For security reasons, do not share this code with anyone.
      </p>
      
      <hr style="border: 0; border-top: 1px solid #eeeeee; margin-bottom: 16px;" />
      
      <!-- Footer -->
      <p style="color: #999999; font-size: 12px; text-align: center; margin: 0;">
        If you didn't request this email, you can safely ignore it.
      </p>
    </div>
  `
});
 
    
  
    return res.status(200).json({ 
      message: "A fresh OTP has been sent to your email." 
    });

  } catch (error) {
    return res.status(500).json({ message: `Resend OTP error: ${error.message}` });
  }
};


// for verify user if session expired
export const requestVerificationOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email. Please sign up." });
    }

    
    if (user.isVerified) {
      return res.status(400).json({ message: "Account is already verified. Please log in directly." });
    }

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    
  
  await apiInstance.transactionalEmails.sendTransacEmail({
  sender: { email: "sarthaksingh20205@gmail.com", name: "SafarStay" }, 
  to: [{ email: user.email }],
  subject: "OTP VERIFICATION",
  htmlContent: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
      <!-- Header / Logo Area -->
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #333333; margin: 0; font-size: 24px; font-weight: 600;">SafarStay</h2>
        <p style="color: #666666; font-size: 14px; margin-top: 4px;">Account Verification</p>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #eeeeee; margin-bottom: 24px;" />
      
      <!-- Body Content -->
      <p style="color: #444444; font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">
        Hello,
      </p>
      <p style="color: #444444; font-size: 16px; line-height: 1.5; margin: 0 0 24px 0;">
        Thank you for registering! Please use the following One-Time Password (OTP) to complete your verification process. This code is active for <strong>5 minutes</strong>.
      </p>
      
      <!-- OTP Box -->
      <div style="text-align: center; background-color: #f4f6f9; border-radius: 6px; padding: 16px; margin-bottom: 24px; letter-spacing: 4px;">
        <span style="font-size: 32px; font-weight: 700; color: #1e3a8a; font-family: monospace;">${otp}</span>
      </div>
      
      <p style="color: #ff3b30; font-size: 13px; text-align: center; margin: 0 0 24px 0;">
        ⚠️ For security reasons, do not share this code with anyone.
      </p>
      
      <hr style="border: 0; border-top: 1px solid #eeeeee; margin-bottom: 16px;" />
      
      <!-- Footer -->
      <p style="color: #999999; font-size: 12px; text-align: center; margin: 0;">
        If you didn't request this email, you can safely ignore it.
      </p>
    </div>
  `
});

    
    const verifyToken = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    
    res.cookie("verifyToken", verifyToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 5 * 60 * 1000
    });

    return res.status(200).json({
      message: "A new OTP has been sent. Proceed to verification page."
    });

  } catch (error) {
    return res.status(500).json({ message: `Verification request error: ${error.message}` });
  }
};
