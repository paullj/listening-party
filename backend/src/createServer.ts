import { sendData } from "./sockets/sendData";
import {
	createRoom,
	joinRoom,
	leaveRoom,
	sendAnswer,
	sendCandidate,
	sendOffer,
} from "./sockets/events";
import { generateUUID } from "./utils/generateUUID";
import { isJSON } from "./utils/isJSON";
import { WebSocketServer } from "ws";

import type { Server } from "http";
import type { Room } from "./models/room";
import type { SocketEvent, SocketEventData } from "./models/socket";
import type { WebSocket } from "ws";

let rooms: Map<string, Room> = new Map();

rooms.set("abc123", {
	name: "Test Room",
	connections: new Map<string, WebSocket>(),
});

const createSocketServer = (httpServer: Server) => {
	const server = new WebSocketServer({ server: httpServer });

	server.on("connection", (socket: WebSocket) => {
		let userId: string = generateUUID();

		socket.on("message", (message: string) => {
			if (!isJSON(message)) {
				console.error(`Error! Received invalid JSON from client: '${message}'`);
				return;
			}

			const parsedEvent = JSON.parse(message) as SocketEvent;

			switch (parsedEvent.type) {
				case "Connect":
					sendData("ConnectSuccessful", socket, {
						userId,
					});
					break;
				case "CreateRoom":
					const createRoomData =
						parsedEvent.data as SocketEventData<"CreateRoom">;
					createRoom(userId, socket, createRoomData);
					break;
				case "JoinRoom":
					const joinRoomData = parsedEvent.data as SocketEventData<"JoinRoom">;
					joinRoom(userId, socket, joinRoomData);
					break;
				case "SendOffer":
					const sendOfferData =
						parsedEvent.data as SocketEventData<"SendOffer">;
					sendOffer(userId, socket, sendOfferData);
					break;
				case "SendAnswer":
					const sendAnswerData =
						parsedEvent.data as SocketEventData<"SendAnswer">;
					sendAnswer(userId, socket, sendAnswerData);
					break;
				case "SendCandidate":
					const sendCandidateData =
						parsedEvent.data as SocketEventData<"SendCandidate">;
					sendCandidate(userId, socket, sendCandidateData);
					break;
				case "LeaveRoom":
					const leaveRoomData =
						parsedEvent.data as SocketEventData<"LeaveRoom">;
					leaveRoom(userId, socket, leaveRoomData);
					break;
				default:
					break;
			}
		});

		socket.on("close", () => {
			[...rooms.keys()]
				.filter((key) => rooms.get(key)!.connections.has(userId))
				.forEach((roomId) => {
					leaveRoom(userId, socket, { roomId });
				});
		});
	});

	return server;
};

export { rooms, createSocketServer };
