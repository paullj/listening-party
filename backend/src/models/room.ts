import type { WebSocket } from "ws";

interface Room {
	name: string;
	hostId: string;
	connections: Map<string, WebSocket>;
}

export type { Room };
