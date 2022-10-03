import type { SocketEventHandler } from "../../models/socket";
import { sendEvent } from "../sendEvent";

const sendAnswer: SocketEventHandler<"SendAnswer"> = (
	userId,
	_socket,
	data
) => {
	sendEvent("RecieveAnswer", data.roomId, data.to, {
		from: userId,
		answer: data.answer,
	});
};

export { sendAnswer };
