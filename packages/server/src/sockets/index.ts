export * from "./broadcastToRoom";
export * from "./sendInRoom";
export * from "./sendToSocket";

import { sendToSocket } from "./sendToSocket";
import {
  createRoom,
  joinRoom,
  leaveRoom,
  sendAnswer,
  sendCandidate,
  sendOffer,
} from "./events";
import { generateUUID } from "../utils/generateUUID";
import { isJSON } from "../utils/isJSON";
import { WebSocketServer } from "ws";
import { getConnections } from "./events/getConnections";
import { rooms } from "../models/room";

import type { Server } from "http";
import type { SocketEvent, SocketEventData } from "../models/socket";
import type { WebSocket } from "ws";

WebSocketServer.prototype.shouldHandle = (request) => {
  return request.url?.startsWith("/ws") ?? false;
};

const createSocketServer = (httpServer: Server) => {
  const server = new WebSocketServer({ server: httpServer });

  server.on("connection", (socket: WebSocket, request) => {
    const incommingId = request?.url?.split("/").pop();

    // TODO: When using redis for all connections, make sure no ids overlap
    // FIXME: Can't use multiple windows if you use this
    // const userId: string = incommingId ?? generateUUID();
    const userId: string = generateUUID();

    socket.on("message", (message: string) => {
      if (!isJSON(message)) {
        console.error(`Error! Received invalid JSON from client: '${message}'`);
        return;
      }

      const parsedEvent = JSON.parse(message) as SocketEvent;

      switch (parsedEvent.type) {
        case "Connect":
          sendToSocket("ConnectSuccessful", socket, {
            userId,
          });
          break;
        case "CreateRoom":
          const createRoomData =
            parsedEvent.data as SocketEventData<"CreateRoom">;
          createRoom(userId, socket, createRoomData);
          break;
        case "JoinRoom":
          const joinRoomData = parsedEvent.data as SocketEventData<"JoinRoom">;
          joinRoom(userId, socket, joinRoomData);
          break;
        case "GetConnections":
          const getConnectionsData =
            parsedEvent.data as SocketEventData<"GetConnections">;
          getConnections(userId, socket, getConnectionsData);
          break;
        case "SendOffer":
          const sendOfferData =
            parsedEvent.data as SocketEventData<"SendOffer">;
          sendOffer(userId, socket, sendOfferData);
          break;
        case "SendAnswer":
          const sendAnswerData =
            parsedEvent.data as SocketEventData<"SendAnswer">;
          sendAnswer(userId, socket, sendAnswerData);
          break;
        case "SendCandidate":
          const sendCandidateData =
            parsedEvent.data as SocketEventData<"SendCandidate">;
          sendCandidate(userId, socket, sendCandidateData);
          break;
        case "LeaveRoom":
          const leaveRoomData =
            parsedEvent.data as SocketEventData<"LeaveRoom">;
          leaveRoom(userId, socket, leaveRoomData);
          break;
        default:
          break;
      }
    });

    socket.on("close", () => {
      [...rooms.keys()]
        .filter((key) => rooms.get(key)!.connections.has(userId))
        .forEach((roomId) => {
          leaveRoom(userId, socket, { roomId });
        });
    });
  });

  return server;
};

export { createSocketServer };
