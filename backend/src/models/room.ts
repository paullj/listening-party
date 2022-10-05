import type { WebSocket } from "ws";

interface Room {
	name: string;
	owner: string;
	connections: Map<string, WebSocket>;
}

export type { Room };
