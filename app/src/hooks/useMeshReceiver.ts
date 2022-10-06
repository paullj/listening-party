import { useSelector } from "@xstate/react";
import { useEffect, useCallback } from "react";
import { MeshInterpreter } from "../context/MeshContext";
import { useRoomContext } from "../context/RoomContext";
import { useSocketContext } from "../context/SocketContext";

const useMeshReciever = (meshService: MeshInterpreter) => {
	const roomService = useRoomContext();
	const roomId = useSelector(roomService, (state) => state.context.roomId);

	const socket = useSocketContext();

	const isEmpty = useSelector(
		meshService,
		(state) => state.context.mesh.size === 0
	);

	useEffect(() => {
		const listener = (state: any) => {
			if (state.matches("room") && isEmpty) {
				socket.sendEvent("GetConnections", {
					roomId,
				});
				roomService.off(listener);
			}
		};
		roomService.onTransition(listener);

		return () => {
			roomService.off(listener);
		};
	}, [roomService]);

	const handleRecieveConnections = useCallback((connections: string[]) => {
		meshService.send({ type: "CLEAR_MESH" });
		connections.forEach((userId: string) => {
			meshService.send({ type: "ADD_PEER", userId, initiate: true });
		});
	}, []);

	const handleAddPeer = useCallback((userId: string) => {
		meshService.send({ type: "ADD_PEER", userId, initiate: false });
	}, []);

	const handleRemovePeer = useCallback((userId: string) => {
		meshService.send({ type: "REMOVE_PEER", userId });
	}, []);

	const handleRecieveOffer = useCallback((userId: string, offer: string) => {
		meshService.send({
			type: "RECIEVE_OFFER",
			userId,
			offer: JSON.parse(offer),
		});
	}, []);

	const handleRecieveAnswer = useCallback((userId: string, answer: string) => {
		meshService.send({
			type: "RECIEVE_ANSWER",
			userId,
			answer: JSON.parse(answer),
		});
	}, []);

	const handleRecieveCandidate = useCallback(
		(userId: string, candidate: string) => {
			meshService.send({
				type: "RECIEVE_CANDIDATE",
				userId,
				candidate: new RTCIceCandidate(JSON.parse(candidate)),
			});
		},
		[]
	);

	useEffect(() => {
		const unsubscribeRecieveConnections = socket.subscribe(
			"RecieveConnections",
			({ connections }) => handleRecieveConnections(connections)
		);
		const unsubscribeAddPeer = socket.subscribe("AddPeer", ({ userId }) =>
			handleAddPeer(userId)
		);
		const unsubscribeRemovePeer = socket.subscribe("RemovePeer", ({ userId }) =>
			handleRemovePeer(userId)
		);
		const unsubscribeRecieveOffer = socket.subscribe(
			"RecieveOffer",
			({ from, offer }) => handleRecieveOffer(from, offer)
		);
		const unsubscribeRecieveAnswer = socket.subscribe(
			"RecieveAnswer",
			({ from, answer }) => handleRecieveAnswer(from, answer)
		);
		const unsubscribeRecieveCandidate = socket.subscribe(
			"RecieveCandidate",
			({ from, candidate }) => handleRecieveCandidate(from, candidate)
		);

		return () => {
			unsubscribeRecieveConnections();
			unsubscribeAddPeer();
			unsubscribeRemovePeer();
			unsubscribeRecieveOffer();
			unsubscribeRecieveAnswer();
			unsubscribeRecieveCandidate();
		};
	}, [
		socket,
		handleRecieveConnections,
		handleAddPeer,
		handleRemovePeer,
		handleRecieveOffer,
		handleRecieveAnswer,
		handleRecieveCandidate,
	]);
};

export { useMeshReciever };
