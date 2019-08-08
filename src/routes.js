// const{ Router } = require('express');
import { Router } from 'express';

// import User from './app/models/User';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// routes.put('/users', authMiddleware, UserController.update);
routes.use(authMiddleware);

routes.put('/users', UserController.update);

/* routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Patrick Guedes',
    email: 'pgo@email.com',
    password_hash: '123456',
  });

  return res.json(user);
}); */

// routes.get('/', (req, res) => res.json({ message: 'Hello World!!!' }));

// module.exports = routes;
export default routes;
