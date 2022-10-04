import { useCallback, useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketProvider";
import { stateMachine } from "../machines/state";

import type { InterpreterFrom } from "xstate";

const useSocketReciever = (
	stateService: InterpreterFrom<typeof stateMachine>
) => {
	const socket = useContext(SocketContext);

	const handleError = useCallback(({ message }: any) => {
		stateService.send({ type: "ERROR", message });
	}, []);

	const handleConnectSucessful = useCallback(({ userId }: any) => {
		stateService.send({ type: "SET_USER_ID", userId });
	}, []);

	const handleJoinSuccess = useCallback(
		(roomName: string, connections: string[]) => {
			stateService.send({ type: "SUCCESS", roomName });
			connections.forEach((userId: string) => {
				stateService.send({ type: "ADD_TO_ROOM", userId, initiate: false });
			});
		},
		[]
	);

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
		stateService.send({
			type: "RECIEVE_OFFER",
			userId,
			offer: JSON.parse(offer),
		});
	}, []);

	const handleRecieveAnswer = useCallback((userId: string, answer: string) => {
		stateService.send({
			type: "RECIEVE_ANSWER",
			userId,
			answer: JSON.parse(answer),
		});
	}, []);

	const handleRecieveCandidate = useCallback(
		(userId: string, candidate: string) => {
			stateService.send({
				type: "RECIEVE_CANDIDATE",
				userId,
				candidate: new RTCIceCandidate(JSON.parse(candidate)),
			});
		},
		[]
	);

	useEffect(() => {
		const unsubscribeError = socket.subscribe("Error", handleError);
		const unsubscribeConnectSucessful = socket.subscribe(
			"ConnectSuccessful",
			handleConnectSucessful
		);
		const unsubscribeJoinSuccesful = socket.subscribe(
			"JoinSuccesful",
			({ roomName, connections }) => handleJoinSuccess(roomName, connections)
		);
		const unsubscribeCreateSuccessful = socket.subscribe(
			"CreateSuccessful",
			({ roomId }) => handleCreateSuccess(roomId)
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

		socket.sendEvent("Connect", {});

		return () => {
			unsubscribeError();
			unsubscribeConnectSucessful();
			unsubscribeJoinSuccesful();
			unsubscribeCreateSuccessful();
			unsubscribeAddPeer();
			unsubscribeRemovePeer();
			unsubscribeRecieveOffer();
			unsubscribeRecieveAnswer();
			unsubscribeRecieveCandidate();
		};
	}, [
		socket,
		handleError,
		handleConnectSucessful,
		handleJoinSuccess,
		handleCreateSuccess,
		handleAddPeer,
		handleRemovePeer,
		handleRecieveOffer,
		handleRecieveAnswer,
		handleRecieveCandidate,
	]);
};

export { useSocketReciever };
