import type { SocketEventHandler } from "../../models/socket";
import { sendInRoom } from "../sendInRoom";

const sendCandidate: SocketEventHandler<"SendCandidate"> = (
	userId,
	_socket,
	data
) => {
	sendInRoom("RecieveCandidate", data.roomId, data.to, {
		from: userId,
		candidate: data.candidate,
	});
};

export { sendCandidate };
