import './bootstrap';

import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import routes from './routes';
import sentryConfig from './config/sentry';
import initLogger from './config/logger';

import './database';

import radisConfig from './config/redis';
import rateLimitConfig from './config/rateLimit';

class App {
  constructor() {
    initLogger();
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandle();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(helmet());

    this.server.use(
      cors({
        origin: process.env.FRONT_URL,
      })
    );

    this.server.use(express.json());

    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );

    if (process.env.NODE_ENV === 'production') {
      this.server.use(
        new RateLimit({
          store: new RateLimitRedis({
            client: redis.createClient({ ...radisConfig }),
          }),
          ...rateLimitConfig,
        })
      );
    }
  }

  routes() {
    this.server.use(`/api/v${process.env.API_VERSION}`, routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandle() {
    this.server.use(async (err, req, res, next) => {
      const { error } = await new Youch(err, req).toJSON();
      if (error.name === 'ErroHandleLib') {
        const { message, status } = error;
        return res.status(status || 500).json({
          error: message,
        });
      }

      if (process.env.NODE_ENV === 'development') {
        return res.status(500).json(error);
      }
      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
