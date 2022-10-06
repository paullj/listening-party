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
import { PeerAction, PeerActionData } from "../models/actions";
import { useQueueContext } from "../context/QueueContext";

const useMeshService = (): MeshInterpreter => {
	const socket = useSocketContext();
	const roomService = useRoomContext();
	const feedService = useFeedContext();
	const queueService = useQueueContext();

	const userId = useSelector(roomService, (state) => state.context.userId);
	const roomId = useSelector(roomService, (state) => state.context.roomId);

	const meshService = useInterpret(meshMachine, {
		actions: {
			sendAction: (context, event) =>
				sendAction(userId, context.mesh, event.action),
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
							let { type, createdBy, createdAt, data } = JSON.parse(
								message.data
							);
							const action = {
								type,
								createdBy,
								createdAt: new Date(createdAt),
								data: {
									...data,
									createdAt: new Date(data.createdAt),
								},
							} as PeerAction;

							feedService.send({
								type: "ADD_ACTION",
								action,
							});
							switch (action.type) {
								case "AddTrackToQueue":
									queueService.send({
										type: "ADD_TO_QUEUE",
										newTrack: action.data as PeerActionData<"AddTrackToQueue">,
									});
									break;
								case "PreviousTrack":
									queueService.send("PREV_TRACK");
									break;
								case "NextTrack":
									queueService.send("NEXT_TRACK");
									break;
							}
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

const sendAction = (userId: string, mesh: Mesh, action: PeerAction) => {
	mesh.forEach((peer) => {
		if (peer.channel.readyState === "open") {
			peer.channel.send(
				JSON.stringify({
					type: action.type,
					createdAt: new Date().toISOString(),
					createdBy: userId,
					data: action.data,
				})
			);
		}
	});
};

export { useMeshService };
