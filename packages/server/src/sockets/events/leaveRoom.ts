import { rooms } from "../../models/room";
import { broadcastToRoom } from "../broadcastToRoom";
import type { SocketEventHandler } from "../../models/socket";

const leaveRoom: SocketEventHandler<"LeaveRoom"> = (userId, _socket, data) => {
  if (rooms.has(data.roomId)) {
    const room = rooms.get(data.roomId);
    broadcastToRoom(
      "RemovePeer",
      data.roomId,
      userId,
      {
        roomId: data.roomId,
        userId,
      },
      false
    );

    rooms.get(data.roomId)?.connections.delete(userId);

    if (room?.hostId === userId) {
      room.hostId = [...room.connections.keys()][0] ?? "";
      if (room.hostId) {
        broadcastToRoom(
          "TransferHost",
          data.roomId,
          userId,
          {
            hostId: room.hostId,
          },
          false
        );
      }
    }
  }
};

export { leaveRoom };
