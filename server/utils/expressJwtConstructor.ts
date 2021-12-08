import { UnauthorizedError } from 'express-jwt';
import Storage from '../storageProviders/Storage';
import logger from './logger';
import config from '../../config/config.json';

const tokenChecker = async (
  _req: any,
  payload: { username: string; id: string; iat: number },
  done: any,
) => {
  const userInDB = await Storage.User.getUser({ id: payload.id }, true);
  if (userInDB === null || payload.iat < Number(userInDB.lastRevokeTime)) {
    logger.error(payload.id);
    return done(
      new UnauthorizedError('revoked_token', {
        message: `[401] Unauthorized. Invalid token.`,
      }),
      true,
    );
  }
  return done(null, false);
};

const SECRET = config.jwtSecrets;
const expressjwtOptions = {
  secret: SECRET,
  algorithms: ['HS256'],
  isRevoked: tokenChecker,
};

export default expressjwtOptions;
