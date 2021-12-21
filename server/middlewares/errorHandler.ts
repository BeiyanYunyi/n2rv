/* eslint-disable consistent-return */

import { JsonWebTokenError } from 'jsonwebtoken';
import logger from '../utils/logger';

const errorHandler = (error: any, _request: any, response: any, next: any): void => {
  logger.error(error);
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  if (error instanceof JsonWebTokenError) {
    console.log(error.name);
    switch (error.name) {
      case 'invalid signature':
        return response.status(401).send(error.message);
      default:
        break;
    }
  }

  switch (error.name) {
    case 'TypeError':
      return response.status(400).send(error.message).end();
    case 'InvalidMidError':
      return response.status(400).send(error.message).end();
    case 'NotAllowedToSignUpError':
      return response.status(401).send(error.message).end();
    case 'AnonymousNotAllowedError':
      return response.status(401).send(error.message).end();
    case 'ConflictError':
      return response.status(409).send(error.message).end();
    case 'NotFoundError':
      return response.status(404).send(error.message).end();
    default:
      break;
  }

  switch (error.code) {
    case 10000:
      return response.status(409).end();
    case 409:
      return response.status(409).end();
    case 400:
      return response.status(400).send(error.message).end();
    case 'revoked_token':
      return response.status(401).send(error.inner.message).end();
    default:
      break;
  }

  next(error);
};

// 这是最后加载的中间件
export default errorHandler;
