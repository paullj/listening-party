import type { SocketEventHandler } from "../../models/socket";
import { sendInRoom } from "../sendInRoom";

const sendOffer: SocketEventHandler<"SendOffer"> = (userId, _socket, data) => {
	sendInRoom("RecieveOffer", data.roomId, data.to, {
		from: userId,
		offer: data.offer,
	});
};

export { sendOffer };
