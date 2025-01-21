import jwt from 'jsonwebtoken';

const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user._id, username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
};

export default generateAccessToken;
