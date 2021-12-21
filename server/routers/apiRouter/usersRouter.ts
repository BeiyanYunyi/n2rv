import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'express-jwt';
import config from '../../../config/config.json';
import Storage from '../../storageProviders/Storage';
import ConflictError from '../../errors/ConflictError';
import NotAllowedToSignUpError from '../../errors/NotAllowedToSignUpError';
import NotFoundError from '../../errors/NotFoundError';
import expressjwtOptions from '../../utils/expressJwtConstructor';

const usersRouter = express.Router();

require('express-async-errors');

usersRouter.post('/', async (req, res) => {
  const { allowSignUp } = config.usersConfig;
  const { saltRounds } = config.bcryptConfig;
  if (!allowSignUp) throw new NotAllowedToSignUpError('[401] Not allowed to sign up');
  const { body } = req as {
    body: {
      username: string | undefined;
      nickname: string | undefined;
      password: string | undefined;
    };
  };
  if (!body.username || !body.password) {
    return res.status(400).json({ error: 'No username or password' });
  }
  const userInDB = await Storage.getUser({ username: body.username });
  if (userInDB !== null) throw new ConflictError(`${body.username} conflicted.`);
  const passwordHash = await bcrypt.hash(body.password, saltRounds);
  const user = {
    username: body.username,
    nickname: body.nickname || null,
    password: passwordHash,
    lastRevokeTime: Date.now().toString(),
  };
  await Storage.createUser(user);
  const savedUser = await Storage.getUser({ username: body.username });
  return res.json(savedUser);
});

usersRouter.use(jwt(expressjwtOptions));

usersRouter.get('/me', async (req, res) => {
  if (!req.user.username) return res.status(400).end();
  const user = await Storage.getUser({ username: req.user.username });
  if (user === null) {
    throw new NotFoundError(`[404] Not Found ${req.user.username}`);
  }
  return res.json(user);
});

usersRouter.get('/username/:username', async (req, res) => {
  if (!req.params.username) return res.status(400).end();
  const user = await Storage.getUser({ username: req.params.username });
  if (user === null) {
    throw new NotFoundError(`[404] Not Found ${req.params.username}`);
  }
  return res.json(user);
});

usersRouter.get('/id/:id', async (req, res) => {
  if (!req.params.id) return res.status(400).end();
  if (Number.isNaN(Number(req.params.id))) return res.status(400).end();
  const user = await Storage.getUser({ id: req.params.id });
  if (user === null) {
    throw new NotFoundError(`[404] Not Found ${req.params.id}`);
  }
  return res.json(user);
});

usersRouter.put('/', async (req, res) => {
  const { body } = req;
  const user = await Storage.getUser({ id: req.user.id }, true);
  if (user === null) {
    throw new NotFoundError(`[404] Not Found ${req.user.username}`);
  }
  if (!body.oldPassword) {
    return res.status(400).json({ error: 'No oldPassword' });
  }
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(body.oldPassword, user.password);
  if (!passwordCorrect) {
    return res.status(401).json({
      error: 'invalid password',
    });
  }
  let password: string;
  if (body.newPassword) {
    password = await bcrypt.hash(body.newPassword, config.bcryptConfig.saltRounds);
  } else {
    password = user.password;
  }
  const savedUser = await Storage.updateUser(req.user.id, {
    username: body.username ? body.username : undefined,
    nickname: body.nickname ? body.nickname : undefined,
    password,
    lastRevokeTime: Date.now(),
  });
  return res.json(savedUser);
});

usersRouter.delete('/', async (req, res) => {
  const { password } = req.body;
  const user = await Storage.getUser({ username: req.user.username }, true);
  if (user === null) {
    throw new NotFoundError(`[404] Not Found ${req.user.username}`);
  }
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password);
  if (!passwordCorrect) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }
  await Promise.all([Storage.deleteUser(req.user.id)]);
  return res.status(204).end();
});

export default usersRouter;
