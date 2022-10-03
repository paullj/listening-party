import type { SocketEventHandler } from "../../models/socket";
import { sendEvent } from "../sendEvent";

const sendCandidate: SocketEventHandler<"SendCandidate"> = (
	userId,
	_socket,
	data
) => {
	sendEvent("RecieveCandidate", data.roomId, data.to, {
		from: userId,
		candidate: data.candidate,
	});
};

export { sendCandidate };
