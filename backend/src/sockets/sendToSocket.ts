import type { WebSocket } from "ws";
import type {
	SocketEvent,
	SocketEventData,
	SocketEventType,
} from "../models/socket";

const sendToSocket = <K extends SocketEventType>(
	type: K,
	socket: WebSocket,
	data: SocketEventData<K>
) => {
	const event: SocketEvent = {
		type,
		data,
	};

	const response = JSON.stringify(event);
	socket.send(response);
};

export { sendToSocket };
