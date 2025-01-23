import jwt from "jsonwebtoken";
import Token from "../models/tokenModel.js";

class TokenController {
    generateTokens(payload){
        const accessToken = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn: "30m"});
        const refreshToken = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn: "30d"});
        return {accessToken,refreshToken};

    }

    async saveToken(userId,refreshToken){
        const tokenData = await Token.findOne({user:userId});

        if(tokenData){
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        const token = await Token.create({user:userId,refreshToken})
        return token;
    }
}

export default new TokenController();