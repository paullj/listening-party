import { createContext } from 'react';
import { WebSocketDispatcher } from "../helpers/WebSocketDispatcher";

import type { PropsWithChildren } from 'react';
import type { SocketEventType, SocketEventDataMap } from '../models/socket';

export const socket = new WebSocketDispatcher<SocketEventDataMap>(
	"ws://localhost:8080"
);

type Callback<T extends SocketEventType> = (data: SocketEventDataMap[T]) => void

export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }: PropsWithChildren) => (
	<SocketContext.Provider value={socket}>
		{children}
	</SocketContext.Provider>
);


export type { Callback };