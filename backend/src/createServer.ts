import { WebSocket, WebSocketServer } from "ws";
import crypto from "crypto";
import { isJSON } from "./utils/isJSON";

interface Room {
	name: string;
	connections: Map<string, WebSocket>;
}

type MessageTypeDataMap = {
	Connected: { userId: string };
	Error: { message: string };

	Join: { roomId: string };
	Create: { roomName: string };
	Leave: { roomId: string };
	JoinSuccesful: { roomId: string; roomName: string; connections: string[] };
	CreateSuccessful: { roomId: string };

	AddPeer: { roomId: string; userId: string };
	RemovePeer: { roomId: string; userId: string };

	SendOffer: { roomId: string; to: string; offer: string };
	RecieveOffer: { from: string; offer: string };
	SendAnswer: { roomId: string; to: string; answer: string };
	RecieveAnswer: { from: string; answer: string };
	SendCandidate: { roomId: string; to: string; candidate: string };
	RecieveCandidate: { from: string; candidate: string };
};

type FunctionMap<T> = {
	[K in keyof T]?: (userId: string, data: T[K], socket: WebSocket) => void;
};

const generateRandomString = (length: number, chars: string) => {
	var result = "";
	for (let i = length; i > 0; --i)
		result += chars[Math.floor(Math.random() * chars.length)];
	return result;
};

const messageFunctionMap: FunctionMap<MessageTypeDataMap> = {
	Create: (_, { roomName }, socket) => {
		let roomId = "";
		while (!roomId || rooms.has(roomId)) {
			roomId = generateRandomString(6, "0123456789abcdefghijklmnopqrstuvwxyz");
		}
		rooms.set(roomId, {
			name: roomName,
			connections: new Map<string, WebSocket>(),
		});
		sendData(socket, "CreateSuccessful", {
			roomId,
		});
	},
	Join: (userId, { roomId }, socket) => {
		roomId = roomId.toLocaleLowerCase();

		if (rooms.has(roomId)) {
			const room = rooms.get(roomId)!;

			if (!room.connections.has(userId)) {
				room.connections.set(userId, socket);
				sendMessage("JoinSuccesful", roomId, userId, {
					roomId,
					roomName: room.name,
					connections: [...room.connections.keys()].filter(
						(peerId) => peerId != userId
					),
				});
				broadcastMessage("AddPeer", roomId, userId, {
					roomId,
					userId,
				});
			}
			return;
		}
		sendData(socket, "Error", {
			message: `Can't find room, '${roomId}'!`,
		});
	},
	SendOffer: (userId, { roomId, to, offer }) => {
		sendMessage("RecieveOffer", roomId, to, {
			from: userId,
			offer,
		});
	},
	SendAnswer: (userId, { roomId, to, answer }) => {
		sendMessage("RecieveAnswer", roomId, to, {
			from: userId,
			answer,
		});
	},
	SendCandidate: (from, { roomId, to, candidate }) => {
		// console.log(
		// 	`From [${from.slice(0, 6)}] to [${to.slice(0, 6)}] in room [${roomId}]`
		// );
		sendMessage(
			"RecieveCandidate",
			roomId,
			to,
			{
				candidate,
				from,
			},
			false
		);
	},
	Leave: (userId, { roomId }) => {
		leave(roomId, userId);
	},
};

type MessageData<T, K extends keyof T> = T[K];

interface Message<T> {
	type: keyof T;
	data: MessageData<T, keyof T>;
}

let rooms: Map<string, Room> = new Map();

rooms.set("abc123", {
	name: "Test Room",
	connections: new Map<string, WebSocket>(),
});

const createServer = (port: number) => {
	const server = new WebSocketServer({ port });

	server.on("connection", (socket: WebSocket) => {
		let userId: string = crypto.randomUUID();

		sendData(socket, "Connected", {
			userId,
		});

		socket.on("message", (message: string) => {
			if (!isJSON(message)) {
				console.error(`Error! Received invalid JSON from client: '${message}'`);
				return;
			}

			const parsedMessage = JSON.parse(message) as Message<MessageTypeDataMap>;

			messageFunctionMap[parsedMessage.type]?.(
				userId,
				parsedMessage.data as any,
				socket
			);
		});

		socket.on("close", () => {
			[...rooms.keys()]
				.filter((key) => rooms.get(key)!.connections.has(userId))
				.forEach((roomId) => {
					leave(roomId, userId);
				});
		});
	});

	console.log(`Listening on port ${port}`);
	return server;
};

const leave = (roomId: string, userId: string) => {
	if (rooms.has(roomId)) {
		broadcastMessage("RemovePeer", roomId, userId, { roomId, userId });
		rooms.get(roomId)?.connections.delete(userId);
	}
};

const sendData = <K extends keyof MessageTypeDataMap>(
	socket: WebSocket,
	eventType: K,
	eventData: MessageData<MessageTypeDataMap, K>
) => {
	const response = JSON.stringify({
		type: eventType,
		data: eventData,
	});
	socket.send(response);
};

const sendMessage = <K extends keyof MessageTypeDataMap>(
	eventType: K,
	roomId: string,
	userId: string,
	eventData: MessageData<MessageTypeDataMap, K>,
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
			sendData(connectedPeers.get(userId)!, eventType, eventData);
	}
};

const broadcastMessage = <K extends keyof MessageTypeDataMap>(
	eventType: K,
	roomId: string,
	userId: string,
	eventData: MessageData<MessageTypeDataMap, K>,
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
				sendData(peerSocket, eventType, eventData);
			}
		});
	}
};

export { createServer };
