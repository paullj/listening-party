import { rooms } from "../../models/room";

import { sendToSocket } from "../sendToSocket";
import { generateRandomString } from "../../utils/generateRandomString";

import type { WebSocket } from "ws";
import type { SocketEventHandler } from "../../models/socket";

const createRoom: SocketEventHandler<"CreateRoom"> = (userId, socket, data) => {
  let roomId = "";
  while (!roomId || rooms.has(roomId)) {
    roomId = generateRandomString(6, "0123456789abcdefghijklmnopqrstuvwxyz");
  }

  rooms.set(roomId, {
    name: data.roomName,
    hostId: userId,
    connections: new Map<string, WebSocket>(),
  });

  sendToSocket("CreateSuccessful", socket, {
    roomId,
  });
};

export { createRoom };
