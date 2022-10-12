interface Peer {
	userId: string;
	connection: RTCPeerConnection;
	channel: RTCDataChannel;
}

export type { Peer };
