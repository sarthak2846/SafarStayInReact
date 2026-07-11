import jwt from 'jsonwebtoken'

const isAuth = async (req,res,next)=>{

try
{
   let {token} = req.cookies
   if(!token)
   {
     return res.status(400).json({message:'User does not have a token'})
   }

   let verifyToken = jwt.verify(token,process.env.JWT_SECRET);
    if(!verifyToken)
   {
    return  res.status(400).json({message:'User does not have a valid token '}) 
   }

   req.userId=verifyToken.userId;
   next();
}

catch(error)
{
   res.status(500).json({message:`is Auth error ${error}`})
}



}

export default isAuth;