import type { Peer } from "../models/peer";

const createPeer = (userId: string): Peer => {
	const connection = new RTCPeerConnection({
		iceServers: [
			{
				urls: "stun:openrelay.metered.ca:80",
			},
			{
				urls: "turn:openrelay.metered.ca:80",
				username: "openrelayproject",
				credential: "openrelayproject",
			},
		],
	});

	const channel = connection.createDataChannel("message", {
		negotiated: true,
		ordered: true,
		id: 0,
	});

	return {
		userId,
		connection,
		channel,
	};
};

export { createPeer };
