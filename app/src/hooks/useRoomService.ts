import { useInterpret } from "@xstate/react";
import { useNavigate } from "react-router-dom";
import { roomMachine } from "../machines/room";
import { useCallback, useContext, useEffect } from "react";
import {
	Callback,
	SocketContext,
} from "../components/providers/SocketProvider";

const useRoomService = () => {
	const navigate = useNavigate();
	const socket = useContext(SocketContext);

	const roomService = useInterpret(roomMachine, {
		actions: {
			sendJoinRoom: (context) =>
				socket.sendEvent("Join", { roomId: context.roomId }),
			sendCreateRoom: () =>
				socket.sendEvent("Create", { roomName: "New Room" }),
			sendLeaveRoom: (context) =>
				socket.sendEvent("Leave", { roomId: context.roomId }),
			navigateToRoom: (context) =>
				navigate(`room/${context.roomId}`, { replace: true }),
			navigateToHome: () => navigate("/", { replace: true }),
		},
	});

	const handleError = useCallback<Callback<"Error">>(({ message }) => {
		roomService.send({ type: "ERROR", message });
	}, []);

	const handleJoinSuccesful = useCallback<Callback<"JoinSuccesful">>(
		({ roomId, roomName }) => {
			roomService.send({ type: "JOIN_ROOM_SUCCESS", roomId, roomName });
		},
		[]
	);

	const handleCreateSuccessful = useCallback<Callback<"CreateSuccessful">>(
		({ roomId }) => {
			roomService.send({ type: "CREATE_ROOM_SUCCESS", roomId });
		},
		[]
	);

	useEffect(() => {
		socket.subscribe("Error", handleError);
		socket.subscribe("JoinSuccesful", handleJoinSuccesful);
		socket.subscribe("CreateSuccessful", handleCreateSuccessful);
	}, [socket, handleError, handleJoinSuccesful, handleCreateSuccessful]);

	return roomService;
};

export { useRoomService };
