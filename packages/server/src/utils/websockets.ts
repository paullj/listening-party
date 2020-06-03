import { FastifyInstance } from 'fastify';
import websocketPlugin, { SocketStream } from 'fastify-websocket';
import { WebSocketEvent, EventType } from '../types/WebSocketEvent';
import WebSocket from 'ws';
import { logger } from './logger';

const websockets = async (app: FastifyInstance): Promise<void> => {
  const clients: (WebSocket | null)[] = [];
  const rooms : { [key: string]: { clientId: number, username: string }[] } = {};

  app.register(websocketPlugin, {
    options: {
      maxPayload: 1024 * 1024,
      path: '/'
    }
  });

  app.get('/', { websocket: true }, (connection: SocketStream) => {
    const socket: WebSocket = connection.socket;

    logger.debug(`Client '${clients.length}' connected`);
    clients.push(socket);

    socket.onmessage = (message) => {
      let event: WebSocketEvent | null;
      try {
        event = JSON.parse(message.data.toString());
      } catch (error) {
        event = null;
        console.error('Invalid JSON: ', error);
      }

      if (event?.type === EventType.Join) {
        rooms[event?.data.roomId as number] = rooms[event?.data.roomId as number] || [];

        const clientId = clients.indexOf(socket);
        rooms[event?.data.roomId as number].push({
          clientId,
          username: event?.data.username as string
        });

        socket.send(JSON.stringify({
          type: 'receive-clients',
          data: {
            clientId,
            clients: rooms[event?.data.roomId as number]
              .filter(client => client && client.clientId !== clientId)
          }
        }));
      }
      if (event?.type === EventType.Candidate) {
        clients.forEach(client => {
          client !== socket &&
                    client?.send(JSON.stringify({
                      type: 'receive-candidate',
                      data: {
                        from: clients.indexOf(socket),
                        candidate: event?.data.candidate
                      }
                    }));
        });
      }
      if (event?.type === EventType.Offer) {
            clients[event?.data.to as number]?.send(JSON.stringify({
              type: 'receive-offer',
              data: {
                offer: event?.data.offer,
                from: clients.indexOf(socket)
              }
            }));
      }
      if (event?.type === EventType.Answer) {
            clients[event?.data.to as number]?.send(JSON.stringify({
              type: 'receive-answer',
              data: {
                from: clients.indexOf(socket),
                answer: event?.data.answer
              }
            }));
      }
    };

    socket.onclose = () => {
      const clientId = clients.indexOf(socket);
      Object.keys(rooms).forEach(room => {
        rooms[room] = rooms[room].filter(user => user.clientId !== clientId);
      });
      clients[clientId] = null;
      logger.debug(`Client '${clientId}' connected`);
    };
  });
};

export { websockets };
