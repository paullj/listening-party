import { sign } from 'jsonwebtoken';
import { FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import { User } from '../entity/User';
import { TOKEN_NAME } from '../constants';

const createAccessToken = (user: User): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw Error('ACCESS_TOKEN_SECRET not found!');
  }
  return sign({ userId: user.id }, secret, { expiresIn: '15m' });
};

const createRefreshToken = (user: User): string => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw Error('REFRESH_TOKEN_SECRET not found!');
  }
  return sign({ userId: user.id, tokenVersion: user.tokenVersion },
    secret,
    { expiresIn: '1w' }
  );
};

const setRefreshToken = (reply: FastifyReply<ServerResponse>, user: User): void => {
  const refresh = createRefreshToken(user);
  reply.setCookie(TOKEN_NAME, refresh, {
    httpOnly: true,
    path: '/token'
    // TODO: Find out what secure does/means
    // secure: true
  });
};

export { createAccessToken, createRefreshToken, setRefreshToken };
