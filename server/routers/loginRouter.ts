/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from 'bcryptjs';
import express from 'express';
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import config from '../../config/config.json';
import Storage from '../../src/instances/Storage';
import expressjwtOptions from '../utils/expressJwtConstructor';

require('express-async-errors');

const SECRET = config.jwtSecrets;
const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
  const { body } = req;

  const user = await Storage.User.getUser({ username: body.username }, true);
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(body.password, user.password);
  if (!passwordCorrect) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const now = Date.now();

  const userForToken = {
    username: user!.username,
    id: user!.id,
    iat: now,
  };

  const token = jwt.sign(userForToken, SECRET);

  return res.status(200).send({ token });
});

loginRouter.use(expressJwt(expressjwtOptions));

loginRouter.get('/revokeToken', async (req, res) => {
  await Storage.User.updateUser(req.user.id, {
    lastRevokeTime: Date.now(),
  });
  res.status(200).end();
});

export default loginRouter;
