import { createContext, useContext, useState } from "react";
import { WebSocketDispatcher } from "../helpers/WebSocketDispatcher";

import type { PropsWithChildren } from "react";
import type { SocketEventType, SocketEventDataMap } from "../models/socket";

const socket = new WebSocketDispatcher<SocketEventDataMap>(
	import.meta.env.VITE_SOCKET_ENDPOINT
);

type Callback<T extends SocketEventType> = (
	data: SocketEventDataMap[T]
) => void;

const SocketContext = createContext({
	socket,
	reconnect: () => {},
});

const SocketProvider = ({ children }: PropsWithChildren) => {
	const [dispatcher, setDispatcher] = useState(socket);

	const handleReconnect = () => {
		const newDispatcher = new WebSocketDispatcher<SocketEventDataMap>(
			import.meta.env.VITE_SOCKET_ENDPOINT
		);
		setDispatcher(newDispatcher);
	};

	return (
		<SocketContext.Provider
			value={{ socket: dispatcher, reconnect: handleReconnect }}
		>
			{children}
		</SocketContext.Provider>
	);
};

const useSocketContext = () => useContext(SocketContext);

export { SocketContext, SocketProvider, useSocketContext };
export type { Callback };
