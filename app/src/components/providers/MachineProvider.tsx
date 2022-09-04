import { createContext, useCallback, useContext, useEffect } from 'react';

import { stateMachine } from '../../machines/state';

import { assign, InterpreterFrom } from 'xstate';
import { useInterpret } from '@xstate/react';
import { SocketContext } from './SocketProvider';
import { useNavigate } from 'react-router-dom';
import { createPeer, MAX_MESH_SIZE } from '../../helpers/Mesh';

import type { PropsWithChildren } from 'react';
import type { Peer } from '../../helpers/Mesh';
import { isJSON } from '../../utils/isJSON';

const MachineContext = createContext({
	stateService: {} as InterpreterFrom<typeof stateMachine>,
});

const MachineProvider = ({ children }: PropsWithChildren) => {
	const navigate = useNavigate();
	const socket = useContext(SocketContext);

	const stateService = useInterpret(stateMachine, {
		actions: {
			navigateToHome: () => navigate('/'),
			navigateToRoom: ({ roomId }) => navigate(`/room/${roomId}`),
			sendJoinRoom: ({ roomId }) => socket.sendEvent("Join", { roomId }),
			sendCreateRoom: () => socket.sendEvent("Create", { roomName: "New Room" }),
			sendLeaveRoom: ({ roomId }) => socket.sendEvent("Leave", { roomId }),
			addToMesh: assign({
				mesh: (context, event) => {
					if (
						context.mesh.size >= MAX_MESH_SIZE ||
						context.mesh.has(event.userId)
					)
						return context.mesh;

					const peers: Map<string, Peer> = new Map<string, Peer>(context.mesh);
					const newPeer = createPeer(event.userId);

					const { connection, channel } = newPeer;

					connection.onicecandidate = ({ candidate }) => {
						if (candidate) {
							socket.sendEvent("SendCandidate", {
								roomId: context.roomId,
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
									roomId: context.roomId,
									to: event.userId,
									offer: JSON.stringify(connection.localDescription?.toJSON()),
								});
							});
					}

					channel.onopen = () => {
						console.log("open channel");
					};

					channel.close = () => {
						console.log("closed channel");
					};

					channel.onmessage = (message) => {
						if (isJSON(message.data)) {
							const parsedMessage = JSON.parse(message.data);
							console.log(parsedMessage);
						}
					};

					return peers.set(event.userId, newPeer);
				},
			}),
			recieveOffer: (context, event) => {
				if (context.mesh.has(event.userId)) {
					const { connection } = context.mesh.get(event.userId)!;
					connection
						.setRemoteDescription(event.offer)
						.then(() => connection.createAnswer())
						.then((answer) => connection.setLocalDescription(answer))
						.then(() => {
							socket.sendEvent("SendAnswer", {
								roomId: context.roomId,
								to: event.userId,
								answer: JSON.stringify(connection.localDescription?.toJSON()),
							});
						});
				}
			},
			recieveAnswer: (context, event) => {
				if (context.mesh.has(event.userId)) {
					const { connection } = context.mesh.get(event.userId)!;
					connection.setRemoteDescription(event.answer);
				}
			},
			recieveCandidate: (context, event) => {
				if (context.mesh.has(event.userId)) {
					const { connection } = context.mesh.get(event.userId)!;
					connection.addIceCandidate(event.candidate);
				}
			},
		}
	});

	const handleError = useCallback(({ message }: any) => {
		stateService.send({ type: "ERROR", message });
	}, []);


	const handleConnected = useCallback(({ userId }: any) => {
		stateService.send({ type: "SET_USER_ID", userId });
	}, []);

	const handleJoinSuccess = useCallback((roomName: string, connections: string[]) => {
		stateService.send({ type: "SUCCESS", roomName });
		connections.forEach((userId: string) => {
			stateService.send({ type: "ADD_TO_ROOM", userId, initiate: false })
		})
	}, []);

	const handleCreateSuccess = useCallback((roomId: string) => {
		stateService.send({ type: "SUCCESS", roomId });
	}, []);

	const handleAddPeer = useCallback((userId: string) => {
		stateService.send({ type: "ADD_TO_ROOM", userId, initiate: true });
	}, []);

	const handleRemovePeer = useCallback((userId: string) => {
		stateService.send({ type: "REMOVE_FROM_ROOM", userId });
	}, []);

	const handleRecieveOffer = useCallback((userId: string, offer: string) => {
		stateService.send({ type: "RECIEVE_OFFER", userId, offer: JSON.parse(offer) });
	}, []);

	const handleRecieveAnswer = useCallback((userId: string, answer: string) => {
		stateService.send({ type: "RECIEVE_ANSWER", userId, answer: JSON.parse(answer) });
	}, []);

	const handleRecieveCandidate = useCallback((userId: string, candidate: string) => {
		stateService.send({ type: "RECIEVE_CANDIDATE", userId, candidate: new RTCIceCandidate(JSON.parse(candidate)) });
	}, []);

	useEffect(() => {
		socket.subscribe("Error", handleError);
		socket.subscribe("Connected", handleConnected);
		socket.subscribe("JoinSuccesful", ({ roomName, connections }) => handleJoinSuccess(roomName, connections));
		socket.subscribe("CreateSuccessful", ({ roomId }) => handleCreateSuccess(roomId));
		socket.subscribe("AddPeer", ({ userId }) => handleAddPeer(userId));
		socket.subscribe("RemovePeer", ({ userId }) => handleRemovePeer(userId));
		socket.subscribe("RecieveOffer", ({ from, offer }) => handleRecieveOffer(from, offer));
		socket.subscribe("RecieveAnswer", ({ from, answer }) => handleRecieveAnswer(from, answer));
		socket.subscribe("RecieveCandidate", ({ from, candidate }) => handleRecieveCandidate(from, candidate));

	}, [handleConnected]);


	return (
		<>
			<MachineContext.Provider value={{ stateService }}>
				{children}
			</MachineContext.Provider>
		</>
	);
};


export { MachineContext, MachineProvider }