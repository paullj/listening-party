import { rooms } from "../../createServer";
import { sendData } from "../sendData";
import { sendEvent } from "../sendEvent";
import { broadcastEvent } from "../broadcastEvent";

import type { SocketEventHandler } from "../../models/socket";

const MAX_ROOM_SIZE = 10;

const joinRoom: SocketEventHandler<"JoinRoom"> = (userId, socket, data) => {
	let { roomId } = data;
	roomId = roomId.toLocaleLowerCase();

	if (rooms.has(roomId)) {
		const room = rooms.get(roomId)!;

		if (room.connections.size >= MAX_ROOM_SIZE) {
			sendData("Error", socket, {
				message: `Room '${roomId}' is full`,
			});
			return;
		}

		if (!room.connections.has(userId)) {
			room.connections.set(userId, socket);
			if (room.hostId === "" || !room.connections.has(room.hostId)) {
				room.hostId = userId;
				broadcastEvent("TransferHost", data.roomId, userId, {
					hostId: room.hostId,
				});
			}
			sendEvent("JoinSuccesful", roomId, userId, {
				roomId,
				hostId: room.hostId,
				roomName: room.name,
			});
			broadcastEvent("AddPeer", roomId, userId, {
				roomId,
				userId,
			});
		}
		return;
	}
	sendData("Error", socket, {
		message: `Can't find room, '${roomId}'!`,
	});
};

export { joinRoom };
