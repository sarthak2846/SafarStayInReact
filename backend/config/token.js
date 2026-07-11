import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

const getToken = async (userId) =>{
    try
    {
         let token = await jwt.sign({userId},secret, {expiresIn:'2d'} );
         return token;
    }
    catch(error)
    {
      console.log('token Error',error);
    }
}


export default getToken;