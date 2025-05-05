import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookies = (res, userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    secure: true,    
    sameSite: 'none',
     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
