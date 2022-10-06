import { useInterpret } from "@xstate/react";
import { useNavigate } from "react-router-dom";

import { useSocketContext } from "../context/SocketContext";
import { roomMachine } from "../machines/room";

import type { RoomInterpreter } from "../context/RoomContext";

const useRoomService = (): RoomInterpreter => {
	const socket = useSocketContext();
	const navigate = useNavigate();

	const roomService = useInterpret(roomMachine, {
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
		},
	});

	return roomService;
};

export { useRoomService };
