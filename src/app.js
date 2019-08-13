// const express = require('express');
// const routes = require('./routes');
import express from 'express';
import path from 'path';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads')),
    );
  }

  routes() {
    // this.server.get();
    this.server.use(routes);
  }
}

// module.exports = new App().server;
export default new App().server;
