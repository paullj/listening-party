import type { WebSocket } from "ws";

interface Room {
  name: string;
  hostId: string;
  connections: Map<string, WebSocket>;
}

let rooms: Map<string, Room> = new Map();

rooms.set("abc123", {
  name: "Test Room",
  hostId: "",
  connections: new Map<string, WebSocket>(),
});

export { rooms };
export type { Room };
