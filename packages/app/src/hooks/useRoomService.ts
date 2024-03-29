import { useInterpret } from "@xstate/react";
import { useNavigate } from "react-router-dom";

import { useSocketContext } from "../context/SocketContext";
import { roomMachine } from "../machines/room";

import type { RoomInterpreter } from "../context/RoomContext";

const useRoomService = (): RoomInterpreter => {
	const { socket, reconnect } = useSocketContext();
	const navigate = useNavigate();

	const roomService = useInterpret(roomMachine, {
		actions: {
			tryToConnect: (context) => {
				if (socket.readyState === socket.CLOSED) reconnect();
				if (context.userId.trim() === "") {
					socket.sendEvent("Connect", {});
				}
			},
			getConnections: ({ roomId }) => {
				socket.sendEvent("GetConnections", { roomId });
			},
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
