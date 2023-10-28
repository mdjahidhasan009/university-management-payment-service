import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../config';
import ApiError from '../../errors/apiError';
import { JwtHelper } from '../../helpers/jwtHelper';
import { IAuthUser } from '../../interfaces/auth';
import { RedisClient } from '../../shared/redis';

const auth =
  (...requiredRoles: string[]) =>
  async (req: any, res: Response, next: NextFunction) => {
    return new Promise(async (resolve, reject) => {
      const token = req.headers.authorization;

      if (!token) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
      }

      const verifiedUser: IAuthUser | null = JwtHelper.verifyToken(token);

      if (!verifiedUser) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
      }

      if (config.env !== 'development') {
        const storedAccessToken = await RedisClient.getAccessToken(verifiedUser.id);

        if (!storedAccessToken) {
          return reject(
            new ApiError(
              httpStatus.UNAUTHORIZED,
              'Use refresh token to get new access token or login again'
            )
          );
        }

        if (storedAccessToken !== token) {
          return reject(
            new ApiError(httpStatus.UNAUTHORIZED, 'Maybe you are using an old access token')
          );
        }
      }

      req.user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }

      resolve(verifiedUser);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
