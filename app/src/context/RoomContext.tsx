import { createContext, useContext } from "react";
import { InterpreterFrom } from "xstate";
import { roomMachine } from "../machines/room";

import type { PropsWithChildren } from "react";

import { useRoomReciever } from "../hooks/useRoomReciever";
import { useRoomService } from "../hooks/useRoomService";

type RoomInterpreter = InterpreterFrom<typeof roomMachine>;

const RoomContext = createContext<RoomInterpreter>({} as RoomInterpreter);

const RoomProvider = ({ children }: PropsWithChildren) => {
	const roomService = useRoomService();
	useRoomReciever(roomService);

	return (
		<>
			<RoomContext.Provider value={roomService}>
				{children}
			</RoomContext.Provider>
		</>
	);
};

const useRoomContext = () => useContext(RoomContext);

export { RoomContext, RoomProvider, useRoomContext };
export type { RoomInterpreter };
