import { createContext, useContext } from 'react';
import { WebSocketDispatcher } from "../helpers/WebSocketDispatcher";

import type { PropsWithChildren } from 'react';
import type { SocketEventType, SocketEventDataMap } from '../models/socket';

const socket = new WebSocketDispatcher<SocketEventDataMap>(
	import.meta.env.VITE_SOCKET_ENDPOINT
);

type Callback<T extends SocketEventType> = (data: SocketEventDataMap[T]) => void

const SocketContext = createContext(socket);

const SocketProvider = ({ children }: PropsWithChildren) => (
	<SocketContext.Provider value={socket}>
		{children}
	</SocketContext.Provider>
);

const useSocketContext = () => useContext(SocketContext);

export { SocketContext, SocketProvider, useSocketContext };
export type { Callback };