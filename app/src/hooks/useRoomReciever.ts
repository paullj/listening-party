import { useCallback, useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";

import type { RoomInterpreter } from "../context/RoomContext";

const useRoomReciever = (roomService: RoomInterpreter) => {
	const socket = useSocketContext();

	const handleError = useCallback(({ message }: any) => {
		roomService.send({ type: "ERROR", message });
	}, []);

	const handleConnectSucessful = useCallback(({ userId }: any) => {
		roomService.send({ type: "SET_USER_ID", userId });
	}, []);

	const handleJoinSuccess = useCallback((roomName: string) => {
		roomService.send({ type: "SUCCESS", roomName });
	}, []);

	const handleCreateSuccess = useCallback((roomId: string) => {
		roomService.send({ type: "SUCCESS", roomId });
	}, []);

	useEffect(() => {
		const unsubscribeError = socket.subscribe("Error", handleError);
		const unsubscribeConnectSucessful = socket.subscribe(
			"ConnectSuccessful",
			handleConnectSucessful
		);
		const unsubscribeJoinSuccesful = socket.subscribe(
			"JoinSuccesful",
			({ roomName }) => handleJoinSuccess(roomName)
		);
		const unsubscribeCreateSuccessful = socket.subscribe(
			"CreateSuccessful",
			({ roomId }) => handleCreateSuccess(roomId)
		);

		socket.sendEvent("Connect", {});

		return () => {
			unsubscribeError();
			unsubscribeConnectSucessful();
			unsubscribeJoinSuccesful();
			unsubscribeCreateSuccessful();
		};
	}, [
		socket,
		handleError,
		handleConnectSucessful,
		handleJoinSuccess,
		handleCreateSuccess,
	]);
};

export { useRoomReciever };
