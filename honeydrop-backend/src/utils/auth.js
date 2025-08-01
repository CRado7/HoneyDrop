import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const SECRET = process.env.JWT_SECRET || 'my_super_secret_key';
console.log('Using JWT_SECRET:', SECRET); 

export const getUserFromToken = async (token) => {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.id).select('-password');
    return user;
  } catch (err) {
    console.error('Token verification failed:', err);
    return null;
  }
};

