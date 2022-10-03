import type { SocketEventHandler } from "../../models/socket";
import { sendEvent } from "../sendEvent";

const sendOffer: SocketEventHandler<"SendOffer"> = (userId, _socket, data) => {
	sendEvent("RecieveOffer", data.roomId, data.to, {
		from: userId,
		offer: data.offer,
	});
};

export { sendOffer };
