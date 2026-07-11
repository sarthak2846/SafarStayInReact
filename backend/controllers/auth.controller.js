import User from "../model/user.model.js";
import bcrypt from 'bcrypt';
import getToken from "../config/token.js";
import jwt from 'jsonwebtoken';
import resend from "../config/nodeMailer.js";

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

    
     await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: user.email, 
      subject: "OTP VERIFICATION",
      html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes. Verify your account using this email.</p>`,
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
       res.clearCookie("token");
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


     await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: user.email, 
      subject: "OTP VERIFICATION",
      html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes. Verify your account using this email.</p>`,
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

    
     await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: user.email, 
      subject: "OTP VERIFICATION",
      html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes. Verify your account using this email.</p>`,
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
