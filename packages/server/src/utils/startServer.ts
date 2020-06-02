import fastify from 'fastify';
import websocket, { SocketStream } from 'fastify-websocket';
import { WebSocketEvent, EventType} from '../types/WebSocketEvent';


const port = Number(process.env.PORT) || 4000;

const startServer = async () => {
  const app = fastify();


  app.register(websocket, {
    handle,
    options: {
        maxPayload: 1024 * 1024, 
        path: '/',
    }
  });

  let clients: (WebSocket | null)[] = [];
  const rooms : { [key: string]: { clientId: number, username: string }[] } = {};

  function handle (stream: SocketStream) {
    const socket: WebSocket = stream.socket;
    clients.push(socket);

    socket.onmessage = (message) => {
        let event: WebSocketEvent | null;
        try {
            event = JSON.parse(message.data);
        } catch (error) {
          event = null;
          console.error('Invalid JSON: ', error);
        }
        console.log(event)
        if(event?.type === EventType.Join) {
          rooms[event?.data.roomId as number] = rooms[event?.data.roomId as number] || []

          const clientId = clients.indexOf(socket);
          rooms[event?.data.roomId as number].push({ 
            clientId,
            username: event?.data.username as string
          });

          socket?.send(JSON.stringify({
            type: 'receive-clients',
            data: {
              clientId,
              clients: rooms[event?.data.roomId as number]
                .filter(client => client && client.clientId !== clientId)
            }
          }))
        }
        if(event?.type === EventType.Candidate) {
            clients.forEach(client => {
                client !== socket &&
                    client?.send(JSON.stringify({
                        type: 'receive-candidate',
                        data: {
                          from: clients.indexOf(socket),
                          candidate: event?.data.candidate
                        }
                    }))
            })
        }
        if(event?.type === EventType.Offer) {
            clients[event?.data.to as number]?.send(JSON.stringify({
                type: 'receive-offer',
                data: {
                  offer: event?.data.offer,
                  from: clients.indexOf(socket)
                }
            }))
        }
        if(event?.type === EventType.Answer) {
            clients[event?.data.to as number]?.send(JSON.stringify({
                type: 'receive-answer',
                data: {
                  from: clients.indexOf(socket),
                  answer: event?.data.answer
                }
            }))
        }
      }
    socket.onclose = () => {
        const clientId = clients.indexOf(socket)
        console.log(clientId)
        Object.keys(rooms).forEach(room => {
          rooms[room] = rooms[room].filter(user => user.clientId !== clientId)
        });
        clients[clientId] = null
        console.log('Client disconencted')
    }
  }
  
  app.listen(port, 'localhost', (error, address) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    console.log(`🚀 Server ready at ${address}`);
  });
};

export { startServer };
