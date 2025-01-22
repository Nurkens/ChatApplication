import jwt from 'jsonwebtoken';

const generateRefreshToken = (user, res) => {
    const refreshToken = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    res.cookie('refreshToken', refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true, 
        secure: process.env.NODE_ENV !== 'development', 
        sameSite: 'Strict', 
    });

    return refreshToken; 
}
export default generateRefreshToken;
