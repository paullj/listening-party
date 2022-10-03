import type { WebSocket } from "ws";

interface Room {
	name: string;
	connections: Map<string, WebSocket>;
}

export type { Room };
