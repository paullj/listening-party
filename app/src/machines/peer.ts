import { createMachine, interpret } from "xstate";
import { assign } from "xstate/lib/actions";
import { socket } from "../providers/SocketProvider";
import { isJSON } from "../utils/isJSON";

export interface PeerContext {
	id: string;
	offer: boolean;
	peer: RTCPeerConnection;
	channel: RTCDataChannel;
}

type PeerEvent =
	| { type: "RECIEVE_REMOTE_OFFER"; offer: RTCSessionDescription }
	| { type: "HAS_LOCAL_OFFER"; offer?: RTCSessionDescription }
	| { type: "HAS_REMOTE_OFFER" }
	| { type: "NEGOTIATE" }
	| { type: "IS_STABLE" }
	| { type: "RECIEVE_ANSWER"; answer: RTCSessionDescription }
	| { type: "RECIEVE_CANDIDATE"; candidate: RTCIceCandidateInit }
	| { type: "CHANNEL_OPEN" }
	| { type: "CHANNEL_SEND"; data: any }
	| { type: "DISCONNECT" };

const createPeerMachine = (userId: string, roomId: string, offer: boolean) => {
	const peer = new RTCPeerConnection({
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

	const channel = peer.createDataChannel("message", {
		negotiated: true,
		ordered: true,
		id: 0,
	});

	const peerMachine = createMachine(
		{
			context: { id: userId, peer, channel, offer },
			tsTypes: {} as import("./peer.typegen").Typegen0,
			schema: {
				context: {} as PeerContext,
				events: {} as PeerEvent,
				services: {} as {},
			},
			predictableActionArguments: true,
			id: `peer-${userId}`,
			initial: "idle",
			on: {
				RECIEVE_CANDIDATE: {
					actions: (context, event) => {
						context.peer
							.addIceCandidate(event.candidate)
							.catch((error) => console.error(error));
					},
				},
			},
			states: {
				idle: {
					always: {
						cond: "shouldOffer",
						target: "offer",
					},
					on: {
						NEGOTIATE: {
							target: "offer",
						},
						RECIEVE_REMOTE_OFFER: {
							target: "answer",
						},
					},
				},
				offer: {
					entry: "createLocalOffer",
					exit: "sendLocalOffer",
					on: {
						HAS_LOCAL_OFFER: {
							target: "waitForAnswer",
						},
					},
				},
				answer: {
					entry: "recieveRemoteOffer",
					exit: "sendAnswer",
					on: {
						HAS_REMOTE_OFFER: {
							actions: "createAnswer",
						},
						IS_STABLE: {
							target: "stable",
						},
					},
				},
				waitForAnswer: {
					on: {
						RECIEVE_ANSWER: {
							actions: (context, event) => {
								context.peer.setRemoteDescription(event.answer);
							},
						},
						IS_STABLE: {
							target: "stable",
						},
					},
				},
				stable: {
					on: {
						RECIEVE_CANDIDATE: {
							actions: (context, event) => {
								context.peer
									.addIceCandidate(event.candidate)
									.catch((error) => console.error(error));
							},
						},
						CHANNEL_OPEN: {
							target: "open",
						},
					},
				},
				open: {
					on: {
						CHANNEL_SEND: {
							actions: "sendData",
						},
						DISCONNECT: {
							actions: "close",
						},
					},
				},
			},
		},
		{
			services: {},
			guards: {
				shouldOffer: (context) => context.offer,
			},
			actions: {
				createLocalOffer: (context) => {
					context.peer
						.createOffer()
						.then((offer) => context.peer.setLocalDescription(offer))
						.catch(() => console.error("Error in createLocalOffer"));
				},
				sendLocalOffer: (context) => {
					if (context.peer.localDescription) {
						socket.sendEvent("SendOffer", {
							roomId,
							to: context.id,
							offer: JSON.stringify(context.peer.localDescription?.toJSON()),
						});
					}
				},
				recieveRemoteOffer: (context, event) => {
					context.peer
						.setRemoteDescription(event.offer)
						.catch(() => console.error("Error in recieveRemoteOffer"));
				},
				createAnswer: (context) => {
					context.peer
						.createAnswer()
						.then((answer) => context.peer.setLocalDescription(answer))
						.catch(() => console.error("Error in createAnswer"));
				},
				sendAnswer: (context) => {
					if (context.peer.localDescription) {
						socket.sendEvent("SendAnswer", {
							roomId,
							to: context.id,
							answer: JSON.stringify(context.peer.localDescription?.toJSON()),
						});
					}
				},
				sendData: (context, event) => {
					context.channel.send(JSON.stringify(event.data));
				},
				close: (context) => {
					context.channel.close();
					context.peer.close();
				},
			},
		}
	);

	return peerMachine;
};

export const createPeerService = (
	userId: string,
	roomId: string,
	offer: boolean
) => {
	const peerMachine = createPeerMachine(userId, roomId, offer);
	const { peer, channel } = peerMachine.context;
	const peerService = interpret(peerMachine);

	socket.subscribe("RecieveOffer", ({ offer }) => {
		peerService.send({
			type: "RECIEVE_REMOTE_OFFER",
			offer: JSON.parse(offer),
		});
	});

	socket.subscribe("RecieveAnswer", ({ answer }) => {
		peerService.send({
			type: "RECIEVE_ANSWER",
			answer: JSON.parse(answer),
		});
	});

	socket.subscribe("RecieveCandidate", ({ candidate }) => {
		peerService.send({
			type: "RECIEVE_CANDIDATE",
			candidate: new RTCIceCandidate(JSON.parse(candidate)),
		});
	});

	channel.onopen = () => {
		peerService.send({ type: "CHANNEL_OPEN" });
	};
	channel.onclose = () => {
		console.log("channel close");
	};
	channel.onmessage = (message) => {
		if (!isJSON(message.data)) {
			console.error("Invalid JSON");
			return;
		}
		let parsedMessage = JSON.parse(message.data);
		console.log(parsedMessage);
	};

	peer.onicecandidate = ({ candidate }) => {
		if (candidate) {
			socket.sendEvent("SendCandidate", {
				roomId,
				to: userId,
				candidate: JSON.stringify(candidate),
			});
		}
	};

	peer.onsignalingstatechange = (e) => {
		switch (peer.signalingState) {
			case "have-local-offer":
				peerService.send({
					type: "HAS_LOCAL_OFFER",
					offer: peer.localDescription ?? undefined,
				});
				break;
			case "have-remote-offer":
				peerService.send({ type: "HAS_REMOTE_OFFER" });
				break;
			case "stable":
				peerService.send({ type: "IS_STABLE" });
				break;
			case "have-remote-pranswer":
			case "closed":
			case "have-local-pranswer":
			default:
				console.error("Signalling Error!");
				break;
		}
	};

	peer.onnegotiationneeded = async () => {
		console.log(peerService.state.value);
		// await pc.setLocalDescription(await pc.createOffer());
		// sc.send({ sdp: pc.localDescription });
	};

	peer.onicecandidateerror = (event) => {
		peerService.send("NEGOTIATE");
	};

	return peerService;
};
