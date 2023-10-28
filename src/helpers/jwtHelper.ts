import { verify } from 'jsonwebtoken';
import config from '../config';
import { IAuthUser } from '../interfaces/auth';

const verifyToken = (token: string) => {
  try {
    const isVerified = verify(token, config.jwt.secret);
    return isVerified as IAuthUser;
  } catch (error) {
    return null;
  }
};

export const JwtHelper = {
  verifyToken
};
