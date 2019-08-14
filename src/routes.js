// const{ Router } = require('express');
import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

// import User from './app/models/User';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';

import authMiddleware from './app/middlewares/auth';
import AgendamentoController from './app/controllers/AgendamentoController';
import AgendaProvedorController from './app/controllers/AgendaProvedorController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// routes.put('/users', authMiddleware, UserController.update);
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);

routes.get('/agendamentos', AgendamentoController.index);
routes.post('/agendamentos', AgendamentoController.store);

routes.get('/agenda-provedores', AgendaProvedorController.index);

// routes.post('/files', upload.single('file'), (req, res) => res.json({ ok: 'ok' }));
// routes.post('/files', upload.single('file'), (req, res) => res.json(req.file));
routes.post('/files', upload.single('file'), FileController.store);

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
