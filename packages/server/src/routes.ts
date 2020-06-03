import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { ServerResponse } from 'http';
import { getConnection } from 'typeorm';
import { verify } from 'jsonwebtoken';

import { User } from './entity/User';
import { ContextPayload } from './types/Context';
import { setRefreshToken, createAccessToken } from './utils/tokens';
import { logger } from './utils/logger';

const routes = async (app: FastifyInstance): Promise<void> => {
  app.post('/token', async (req: FastifyRequest, rep: FastifyReply<ServerResponse>) => {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
      throw Error('REFRESH_TOKEN_SECRET not found!');
    }

    const token = req.cookies.jwt;
    if (!token) {
      return rep.send({ ok: false, accessToken: '' });
    }

    let payload: ContextPayload | null = null;
    try {
      payload = verify(token, secret) as ContextPayload;
    } catch (error) {
      logger.error(`Error! ${error}`);
      return rep.send({ ok: false, accessToken: '' });
    }

    const userRepository = getConnection().getRepository(User);
    const user = await userRepository.findOne(payload.userId);

    if (!user) {
      return rep.send({ ok: false, accessToken: '' });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return rep.send({ ok: false, accessToken: '' });
    }

    setRefreshToken(rep, user);
    return rep.send({ ok: true, accessToken: createAccessToken(user) });
  });
};

export { routes };
