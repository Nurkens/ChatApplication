import User from "../models/User.js";
import bcrypt from 'bcrypt';
import generateAccessToken from "../utils/accesssToken.js";
import generateRefreshToken from "../utils/refreshToken.js";

class authController{
    async registration(req,res){
        try{
            const {username,password} = req.body;
            const candidate = await User.findOne({username});
            if(candidate){
                return res.status(400).json({message:"User with ths username already exists"});
            }
            if(!validator.isEmail(usernmae)){
                return res.status(401).json({message:"Email is not valid"});
            }
            const hashPassword = bcrypt(password,4);

            const user = await User.create({username,password:hashPassword});
            return res.status(201).json({message:"User was created",user});
        }catch(e){
            console.log(e);
        }
        
         
    }
    async login(req,res){
        try{
            const {username,password} = req.body;
            const candidate = await User.findOne(username);

            if(!candidate){
                res.status(400).json({message:"No user with username"});
            }
            const match = bcrypt.compare(password,candidate.password);
            if(match){
                const accessToken = generateAccessToken(candidate);
                const refreshToken = generateRefreshToken(candidate);
            }
            return res.status(200).json(accessToken,refreshToken);
        }catch(e){
            console.log(e);
        }
    }
}

export default new authController();