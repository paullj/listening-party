import { rooms } from "../../createServer";
import { sendData } from "../sendData";
import { generateRandomString } from "../../utils/generateRandomString";

import type { WebSocket } from "ws";
import type { SocketEventHandler } from "../../models/socket";

const createRoom: SocketEventHandler<"CreateRoom"> = (
	_userId,
	socket,
	data
) => {
	let roomId = "";
	while (!roomId || rooms.has(roomId)) {
		roomId = generateRandomString(6, "0123456789abcdefghijklmnopqrstuvwxyz");
	}

	rooms.set(roomId, {
		name: data.roomName,
		connections: new Map<string, WebSocket>(),
	});

	sendData("CreateSuccessful", socket, {
		roomId,
	});
};

export { createRoom };
