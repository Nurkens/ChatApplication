
import jwt from 'jsonwebtoken';

const authUser = (req,res,next) =>{
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(400).json({message:"No permission"});
    }
    try{
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    }catch(e){  
        res.status(401).json({message:"Invalid token"});
    }
}

export default authUser;