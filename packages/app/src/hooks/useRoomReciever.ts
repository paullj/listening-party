import { useCallback, useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";

import type { RoomInterpreter } from "../context/RoomContext";
import { SocketEventData } from "../models/socket";

const useRoomReciever = (roomService: RoomInterpreter) => {
	const { socket } = useSocketContext();

	const handleError = useCallback(
		(data: SocketEventData<"Error">) =>
			roomService.send({ type: "ERROR", ...data }),
		[]
	);

	const handleConnectSucessful = useCallback(
		(data: SocketEventData<"ConnectSuccessful">) => {
			localStorage.setItem("socketId", data.userId);
			roomService.send({ type: "SET_USER_ID", ...data });
		},
		[]
	);

	const handleJoinSuccess = useCallback(
		(data: SocketEventData<"JoinSuccesful">) =>
			roomService.send({ type: "JOIN_SUCCESS", ...data }),
		[]
	);

	const handleCreateSuccess = useCallback(
		(data: SocketEventData<"CreateSuccessful">) =>
			roomService.send({ type: "CREATE_SUCCESS", ...data }),
		[]
	);

	const handleTransferHost = useCallback(
		(data: SocketEventData<"TransferHost">) =>
			roomService.send({ type: "SET_HOST_ID", ...data }),
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
			handleJoinSuccess
		);
		const unsubscribeCreateSuccessful = socket.subscribe(
			"CreateSuccessful",
			handleCreateSuccess
		);
		const unsubscribeTransferHost = socket.subscribe(
			"TransferHost",
			handleTransferHost
		);

		return () => {
			unsubscribeError();
			unsubscribeConnectSucessful();
			unsubscribeJoinSuccesful();
			unsubscribeCreateSuccessful();
			unsubscribeTransferHost();
		};
	}, [
		socket,
		roomService,
		handleError,
		handleConnectSucessful,
		handleJoinSuccess,
		handleCreateSuccess,
		handleTransferHost,
	]);
};

export { useRoomReciever };
