import { rooms } from "../../createServer";
import { broadcastEvent } from "../broadcastEvent";
import type { SocketEventHandler } from "../../models/socket";
import { sendEvent } from "../sendEvent";

const leaveRoom: SocketEventHandler<"LeaveRoom"> = (userId, _socket, data) => {
	if (rooms.has(data.roomId)) {
		const room = rooms.get(data.roomId);
		broadcastEvent("RemovePeer", data.roomId, userId, {
			roomId: data.roomId,
			userId,
		});

		rooms.get(data.roomId)?.connections.delete(userId);

		if (room?.hostId === userId) {
			room.hostId = [...room.connections.keys()][0] ?? "";
			broadcastEvent("TransferHost", data.roomId, userId, {
				hostId: room.hostId,
			});
		}
	}
};

export { leaveRoom };
