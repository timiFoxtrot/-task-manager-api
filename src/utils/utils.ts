import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export const toHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

export const compare = async (storedPassword: string, suppliedPassword: string) => {
  return await bcrypt.compare(suppliedPassword, storedPassword)
}

export const loginToken = (_id: string) => {
  const secret = process.env.JWTLOGINSECRET as string;
  return jwt.sign({ _id }, secret, { expiresIn: '7d' });
};