import { rooms } from "../../models/room";
import { sendToSocket } from "../sendToSocket";

import type { SocketEventHandler } from "../../models/socket";

const getConnections: SocketEventHandler<"GetConnections"> = (
  userId,
  socket,
  data
) => {
  let { roomId } = data;
  roomId = roomId.toLocaleLowerCase();

  if (rooms.has(roomId)) {
    const room = rooms.get(roomId)!;
    if (room.connections.has(userId)) {
      sendToSocket("RecieveConnections", socket, {
        connections: [...room.connections.keys()].filter(
          (peerId) => peerId != userId
        ),
      });
      return;
    }
  }
  sendToSocket("Error", socket, {
    message: `Can't access connections!`,
  });
};

export { getConnections };
