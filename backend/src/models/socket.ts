import type { WebSocket } from "ws";

type SocketEventType = keyof SocketEventDataMap;

interface SocketEvent {
	type: SocketEventType;
	data: SocketEventDataMap[keyof SocketEventDataMap];
}

type SocketEventData<T extends SocketEventType> = SocketEventDataMap[T];

interface SocketEventDataMap {
	Connected: { userId: string };
	Error: { message: string };

	// Room Events
	JoinRoom: { roomId: string };
	CreateRoom: { roomName: string };
	LeaveRoom: { roomId: string };
	JoinSuccesful: { roomId: string; roomName: string; connections: string[] };
	CreateSuccessful: { roomId: string };

	// Peer Events
	AddPeer: { roomId: string; userId: string };
	RemovePeer: { roomId: string; userId: string };

	// Signalling Events
	SendOffer: { roomId: string; to: string; offer: string };
	RecieveOffer: { from: string; offer: string };
	SendAnswer: { roomId: string; to: string; answer: string };
	RecieveAnswer: { from: string; answer: string };
	SendCandidate: { roomId: string; to: string; candidate: string };
	RecieveCandidate: { from: string; candidate: string };
}

type SocketEventHandler<T extends SocketEventType> = (
	userId: string,
	socket: WebSocket,
	data: SocketEventData<T>
) => void;

export type {
	SocketEventType,
	SocketEventData,
	SocketEvent,
	SocketEventHandler,
};
