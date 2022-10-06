import { assign } from "xstate";
import { useInterpret, useSelector } from "@xstate/react";

import { useSocketContext } from "../context/SocketContext";
import { useFeedContext } from "../context/FeedContext";
import { useRoomContext } from "../context/RoomContext";
import { meshMachine } from "../machines/mesh";
import { isJSON } from "../utils/isJSON";

import type { Peer } from "../models/peer";
import type { Mesh } from "../models/mesh";
import type { MeshInterpreter } from "../context/MeshContext";

const useMeshService = (): MeshInterpreter => {
	const socket = useSocketContext();
	const stateService = useRoomContext();
	const feedService = useFeedContext();

	const userId = useSelector(stateService, (state) => state.context.userId);
	const roomId = useSelector(stateService, (state) => state.context.roomId);

	const meshService = useInterpret(meshMachine, {
		actions: {
			sendData: (context, event) => {
				context.mesh.forEach((peer) => {
					if (peer.channel.readyState === "open") {
						peer.channel.send(
							JSON.stringify({
								...event.data,
								createdAt: new Date(),
								createdBy: userId,
							})
						);
					}
				});
			},
			addToMesh: assign({
				mesh: (context, event) => {
					if (context.mesh.has(event.userId)) return context.mesh;

					if (!roomId) return context.mesh;

					const peers: Mesh = new Map<string, Peer>(context.mesh);
					const newPeer = createPeer(event.userId);

					const { connection, channel } = newPeer;

					connection.onnegotiationneeded = () => {};

					connection.onicecandidate = ({ candidate }) => {
						if (candidate) {
							socket.sendEvent("SendCandidate", {
								roomId,
								to: event.userId,
								candidate: JSON.stringify(candidate),
							});
						}
					};

					// Create offer and then send
					if (event.initiate) {
						connection
							.createOffer()
							.then((offer) => connection.setLocalDescription(offer))
							.then(() => {
								socket.sendEvent("SendOffer", {
									roomId,
									to: event.userId,
									offer: JSON.stringify(connection.localDescription?.toJSON()),
								});
							})
							.catch((err) => {
								console.error("Offer initiation error!");
							});
					}

					channel.onopen = () => {};
					channel.onclose = () => {};

					channel.onmessage = (message) => {
						if (isJSON(message.data)) {
							const parsedMessage = JSON.parse(message.data);
							feedService.send({
								type: "ADD_MESSAGE",
								message: {
									...parsedMessage,
									createdAt: new Date(parsedMessage.createdAt),
								},
							});
							console.log(parsedMessage);
						}
					};

					return peers.set(event.userId, newPeer);
				},
			}),
			recieveOffer: (context, event) => {
				if (context.mesh.has(event.userId)) {
					const { connection } = context.mesh.get(event.userId)!;
					if (!connection.remoteDescription)
						connection
							.setRemoteDescription(event.offer)
							.then(() => connection.createAnswer())
							.then((answer) => connection.setLocalDescription(answer))
							.then(() => {
								socket.sendEvent("SendAnswer", {
									roomId,
									to: event.userId,
									answer: JSON.stringify(connection.localDescription?.toJSON()),
								});
							})
							.catch((err) => {
								console.error("Offer recieve error!");
							});
				}
			},
		},
	});

	return meshService;
};

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

export { useMeshService };
