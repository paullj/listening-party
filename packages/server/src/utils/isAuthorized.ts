import { ContextPayload, Context } from '../types/Context';
import { verify } from 'jsonwebtoken';

const isAuthorized = (context: Context): boolean => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw Error('ACCESS_TOKEN_SECRET not found!');
  }

  const { authorization } = context.req.headers;

  if (!authorization) {
    return false;
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = verify(token, secret) as ContextPayload;
    if (payload) {
      context.payload = payload;
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};

export { isAuthorized };
