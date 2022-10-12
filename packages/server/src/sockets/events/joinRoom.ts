import { rooms } from "../../createServer";
import { sendToSocket } from "../sendToSocket";
import { sendInRoom } from "../sendInRoom";
import { broadcastToRoom } from "../broadcastToRoom";

import type { SocketEventHandler } from "../../models/socket";

const MAX_ROOM_SIZE = 10;

const joinRoom: SocketEventHandler<"JoinRoom"> = (userId, socket, data) => {
	let { roomId } = data;
	roomId = roomId.toLocaleLowerCase();

	if (rooms.has(roomId)) {
		const room = rooms.get(roomId)!;

		if (room.connections.size >= MAX_ROOM_SIZE) {
			sendToSocket("Error", socket, {
				message: `Room '${roomId}' is full`,
			});
			return;
		}

		if (!room.connections.has(userId)) {
			room.connections.set(userId, socket);
			if (room.hostId === "" || !room.connections.has(room.hostId)) {
				room.hostId = userId;
				broadcastToRoom("TransferHost", data.roomId, userId, {
					hostId: room.hostId,
				});
			}
			sendInRoom("JoinSuccesful", roomId, userId, {
				roomId,
				hostId: room.hostId,
				roomName: room.name,
			});
			broadcastToRoom("AddPeer", roomId, userId, {
				roomId,
				userId,
			});
		}
		return;
	}
	sendToSocket("Error", socket, {
		message: `Can't find room, '${roomId}'!`,
	});
};

export { joinRoom };
