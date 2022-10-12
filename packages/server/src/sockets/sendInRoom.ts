import { rooms } from "../models/room";

import type { SocketEventData, SocketEventType } from "../models/socket";
import { sendToSocket } from "./sendToSocket";

const sendInRoom = <K extends SocketEventType>(
  eventType: K,
  roomId: string,
  userId: string,
  eventData: SocketEventData<K>,
  log: boolean = true
) => {
  if (eventData && rooms.has(roomId)) {
    const connectedPeers = rooms.get(roomId)?.connections;
    if (log)
      console.log(
        `Sending [${eventType}] to user [${userId.slice(
          0,
          6
        )}] in room [${roomId}]`
      );

    if (connectedPeers?.has(userId))
      sendToSocket(eventType, connectedPeers.get(userId)!, eventData);
  }
};

export { sendInRoom };
