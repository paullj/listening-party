import { useInterpret } from "@xstate/react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assign, type InterpreterFrom } from "xstate";

import { SocketContext } from "../context/SocketProvider";
import { createPeer } from "../machines/peer";
import { stateMachine } from "../machines/state";
import { isJSON } from "../utils/isJSON";

import type { Mesh } from "../models/mesh";
import type { Peer } from "../models/peer";

const useStateService = (): InterpreterFrom<typeof stateMachine> => {
	const socket = useContext(SocketContext);
	const navigate = useNavigate();

	const stateService = useInterpret(stateMachine, {
		actions: {
			navigateToHome: () => navigate("/"),
			navigateToRoom: ({ roomId }) => navigate(`/room/${roomId}`),
			navigateToError: () => navigate("/error"),
			sendJoinRoom: ({ roomId }) => {
				if (roomId) socket.sendEvent("JoinRoom", { roomId });
			},
			sendCreateRoom: () =>
				socket.sendEvent("CreateRoom", { roomName: "New Room" }),
			sendLeaveRoom: ({ roomId }) => {
				if (roomId) socket.sendEvent("LeaveRoom", { roomId });
			},
			addToMesh: assign({
				mesh: (context, event) => {
					if (context.mesh.has(event.userId)) return context.mesh;

					if (!context.roomId) return context.mesh;

					const peers: Mesh = new Map<string, Peer>(context.mesh);
					const newPeer = createPeer(event.userId);

					const { connection, channel } = newPeer;

					connection.onnegotiationneeded = () => {
						// connection
						// 	.createOffer()
						// 	.then((offer) => connection.setLocalDescription(offer))
						// 	.then(() =>
						// 		socket.sendEvent("SendOffer", {
						// 			roomId: context.roomId!,
						// 			to: event.userId,
						// 			offer: JSON.stringify(connection.localDescription),
						// 		})
						// 	)
						// 	.catch((err) => {
						// 		console.error("Negogiation error!");
						// 	});
					};

					connection.onicecandidate = ({ candidate }) => {
						if (candidate) {
							socket.sendEvent("SendCandidate", {
								roomId: context.roomId!,
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
									roomId: context.roomId!,
									to: event.userId,
									offer: JSON.stringify(connection.localDescription?.toJSON()),
								});
							})
							.catch((err) => {
								console.error("Offer initiation error!");
							});
					}

					channel.onopen = () => {
						// console.log("open channel");
					};

					channel.close = () => {
						// console.log("closed channel");
					};

					channel.onmessage = (message) => {
						if (isJSON(message.data)) {
							const parsedMessage = JSON.parse(message.data);
							console.log(parsedMessage);
							stateService.send({
								type: "ADD_MESSAGE",
								content: parsedMessage.content,
								created: new Date(parsedMessage.created),
								userId: parsedMessage.userId,
							});
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
									roomId: context.roomId!,
									to: event.userId,
									answer: JSON.stringify(connection.localDescription?.toJSON()),
								});
							})
							.catch((err) => {
								console.error("Offer recieve error!");
							});
				}
			},
			recieveAnswer: (context, event) => {
				if (context.mesh.has(event.userId)) {
					const { connection } = context.mesh.get(event.userId)!;
					if (!connection.remoteDescription)
						connection.setRemoteDescription(event.answer).catch((err) => {
							console.error("Answer recieve error!");
						});
				}
			},
			recieveCandidate: (context, event) => {
				if (context.mesh.has(event.userId)) {
					const { connection } = context.mesh.get(event.userId)!;
					connection.addIceCandidate(event.candidate).catch((err) => {
						console.error("Candidate recieve error!");
					});
				}
			},
		},
	});

	return stateService;
};

export { useStateService };
