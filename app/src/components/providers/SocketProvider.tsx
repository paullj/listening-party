import { createContext } from 'react';
import { WebSocketDispatcher } from "../../helpers/WebSocketDispatcher";

import type { Subscriber } from "../../helpers/WebSocketDispatcher";
import type { PropsWithChildren } from 'react';

export type MessageTypeDataMap = {
	Connected: { userId: string };
	Error: { message: string };

	Join: { roomId: string };
	Create: { roomName: string };
	Leave: { roomId: string };
	JoinSuccesful: { roomId: string; roomName: string; connections: string[] };
	CreateSuccessful: { roomId: string };

	AddPeer: { roomId: string; userId: string };
	RemovePeer: { roomId: string; userId: string };

	SendOffer: { roomId: string; to: string; offer: string };
	RecieveOffer: { from: string; offer: string };
	SendAnswer: { roomId: string; to: string; answer: string };
	RecieveAnswer: { from: string; answer: string };
	SendCandidate: { roomId: string; to: string; candidate: string };
	RecieveCandidate: { from: string; candidate: string };

};

export const socket = new WebSocketDispatcher<MessageTypeDataMap>(
	"ws://localhost:8080"
);

type Callback<T extends keyof MessageTypeDataMap> = (data: MessageTypeDataMap[T]) => void

export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }: PropsWithChildren) => (
	<SocketContext.Provider value={socket}>
		{children}
	</SocketContext.Provider>
);


export type { Callback };