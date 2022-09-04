export interface Peer {
	userId: string;
	connection: RTCPeerConnection;
	channel: RTCDataChannel;
}

export const MAX_MESH_SIZE = 5;

export const createPeer = (userId: string): Peer => {
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

// class Mesh {
// 	private maxSize: number;
// 	private peers: Map<string, Peer>;

// 	constructor(options: MeshOptions = defaultOptions) {
// 		this.peers = new Map<string, Peer>();
// 		this.maxSize = options.maxSize;
// 	}

// 	public get size() {
// 		return this.peers.size;
// 	}

// 	public get list() {
// 		return [...this.peers.values()];
// 	}

// 	has(id: string): boolean {
// 		return this.peers.has(id);
// 	}

// 	get(id: string): Peer | null {
// 		return this.peers.get(id) ?? null;
// 	}

// 	add(userId: string, roomId: string, offer: boolean = false): Peer | null {
// 		if (this.size >= this.maxSize) return null;
// 		if (this.has(userId)) return this.get(userId);

// 		const peer = createPeer(userId);

// 		const recieveOffer = (data: any) => {
// 			const { from, offer } = data;
// 			if (this.has(from)) {
// 				const { connection } = this.get(from)!;
// 				connection
// 					.setRemoteDescription(JSON.parse(offer))
// 					.then(() => connection.createAnswer())
// 					.then((answer) => connection.setLocalDescription(answer))
// 					.then(() => {
// 						socket.sendEvent("SendAnswer", {
// 							roomId,
// 							to: userId,
// 							answer: JSON.stringify(connection.localDescription?.toJSON()),
// 						});
// 					});
// 			}
// 		};

// 		const unsubscribeOffer = socket.subscribe("RecieveOffer", recieveOffer);

// 		const recieveAnswer = (data: any) => {
// 			const { from, answer } = data;
// 			if (this.has(from)) {
// 				const { connection } = this.get(from)!;
// 				connection.setRemoteDescription(JSON.parse(answer));
// 			}
// 		};
// 		const unsubscribeAnswer = socket.subscribe("RecieveAnswer", recieveAnswer);

// 		const recieveCandidate = (data: any) => {
// 			const { from, candidate } = data;
// 			if (this.has(from)) {
// 				const { connection } = this.get(from)!;
// 				connection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
// 			}
// 		};

// 		const unsubscribeCandidate = socket.subscribe(
// 			"RecieveCandidate",
// 			recieveCandidate
// 		);

// 		const { connection, channel } = peer;

// 		connection.onicecandidate = ({ candidate }) => {
// 			if (candidate) {
// 				socket.sendEvent("SendCandidate", {
// 					roomId,
// 					to: userId,
// 					candidate: JSON.stringify(candidate),
// 				});
// 			}
// 		};

// 		// Create offer and then send
// 		if (offer) {
// 			connection
// 				.createOffer()
// 				.then((offer) => connection.setLocalDescription(offer))
// 				.then(() => {
// 					socket.sendEvent("SendOffer", {
// 						roomId,
// 						to: userId,
// 						offer: JSON.stringify(connection.localDescription?.toJSON()),
// 					});
// 				});
// 		}

// 		channel.onopen = () => {
// 			console.log("open channel");
// 			// unsubscribeOffer();
// 			// unsubscribeAnswer();
// 		};

// 		channel.close = () => {
// 			this.remove(userId);
// 		};

// 		channel.onmessage = (message) => {
// 			console.log(message.data);
// 		};

// 		this.peers.set(userId, peer);
// 		return peer;
// 	}

// 	remove(id: string) {
// 		console.error("Not implemented");
// 		// throw "Not implemented!";
// 	}

// 	clear() {
// 		console.error("Not implemented");
// 		// throw "Not implemented!";
// 	}
// }

// export { Mesh };
