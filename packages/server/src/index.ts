import 'reflect-metadata';
import env from 'dotenv';

import fastify from 'fastify';
import gql from 'fastify-gql';
import cookie from 'fastify-cookie';
import cors from 'fastify-cors';

import { routes } from './routes';
import { createDatabaseConnection } from './utils/database';
import { generateSchema } from './utils/schema';
import { logger } from './utils/logger';

env.config();

const port = Number(process.env.PORT) || 4000;

const startServer = async () : Promise<void> => {
  const app = fastify();
  await createDatabaseConnection();

  app.register(cors, {
    origin: [
      'http://localhost:8080',
      'http://127.0.0.1:8080'
    ],
    credentials: true
  });

  app.register(cookie);

  app.register(gql, {
    schema: await generateSchema(),
    context: (req: any, res: any) => {
      return { req, res };
    },
    jit: 1,
    graphiql: 'playground',
    subscription: true
  });

  app.register(routes);

  app.setErrorHandler((error, request, reply) => {
    logger.error(`Error! ${error}`);
    logger.debug(`Requested at '${request.req.url}'`);
    logger.debug(`With payload '${request.body}'`);
    reply.status(500).send({ message: 'Error occurred during request' });
  });

  app.listen(port, 'localhost', (error, address) => {
    if (error) {
      logger.error(`Error! ${error}`);
      process.exitCode = 1;
    }
    logger.info(`🚀 Server ready at ${address}`);
    if (process.env.NODE_ENV === 'development') {
      logger.info(`📈 GraphQL playground at ${address}/playground`);
    }
  });
};

startServer();
