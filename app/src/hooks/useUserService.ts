import { useInterpret } from "@xstate/react";

import { userMachine } from "../machines/user";
import { useCallback, useContext, useEffect } from "react";
import { Callback, SocketContext } from "../providers/SocketProvider";

const useUserService = () => {
	const socket = useContext(SocketContext);
	const userService = useInterpret(userMachine);

	const handleConnected = useCallback<Callback<"Connected">>(({ userId }) => {
		userService.send({ type: "CONNECT", userId });
	}, []);

	useEffect(() => {
		socket.subscribe("Connected", handleConnected);
	}, []);

	return userService;
};

export { useUserService };
