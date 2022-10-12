import { rooms } from "../models/room";
import type { SocketEventData, SocketEventType } from "../models/socket";
import { sendToSocket } from "./sendToSocket";

const broadcastToRoom = <K extends SocketEventType>(
  eventType: K,
  roomId: string,
  userId: string,
  eventData: SocketEventData<K>,
  log: boolean = true
) => {
  if (rooms.has(roomId)) {
    const connectedPeers = rooms.get(roomId)?.connections;
    if (log)
      console.log(
        `User [${userId.slice(0, 6)}] is broadcasting [${eventType}] to ${
          (connectedPeers?.size ?? 0) - 1
        } peer(s) in room [${roomId}]`
      );
    connectedPeers?.forEach((peerSocket, peerId) => {
      if (peerId !== userId) {
        sendToSocket(eventType, peerSocket, eventData);
      }
    });
  }
};

export { broadcastToRoom };
