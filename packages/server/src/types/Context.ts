import { FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse, IncomingMessage } from 'http';

export interface Context {
  req: FastifyRequest<IncomingMessage>;
  res: FastifyReply<ServerResponse>;
  payload?: ContextPayload;
}

export interface ContextPayload {
  tokenVersion: number;
  userId: string;
}
