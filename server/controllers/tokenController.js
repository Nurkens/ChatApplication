import jwt from "jsonwebtoken";
import Token from "../models/tokenModel.js";

class TokenController {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
        return { accessToken, refreshToken };
    }

    async saveToken(userId, refreshToken) {
        const existingToken = await Token.findOne({ user: userId });
        if (existingToken) {
            existingToken.refreshToken = refreshToken;
            return existingToken.save();
        }
        return await Token.create({ user: userId, refreshToken });
    }

    async removeToken(refreshToken) {
        return await Token.deleteOne({ refreshToken });
    }

    async findToken(refreshToken) {
        return await Token.findOne({ refreshToken });
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch (e) {
            return null;
        }
    }
}

export default new TokenController();