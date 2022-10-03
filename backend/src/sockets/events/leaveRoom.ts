import { rooms } from "../../createServer";
import { broadcastEvent } from "../broadcastEvent";
import type { SocketEventHandler } from "../../models/socket";

const leaveRoom: SocketEventHandler<"LeaveRoom"> = (userId, _socket, data) => {
	if (rooms.has(data.roomId)) {
		broadcastEvent("RemovePeer", data.roomId, userId, {
			roomId: data.roomId,
			userId,
		});
		rooms.get(data.roomId)?.connections.delete(userId);
	}
};

export { leaveRoom };
