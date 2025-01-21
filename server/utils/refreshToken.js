import jwt from 'jsonwebtoken';

const generateRefreshToken = (user) =>{
    return jwt.sign(
        {userId:user._id,username:user.username},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'7d'}
    );
};

export default generateRefreshToken;