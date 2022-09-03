import { createContext, useCallback, useContext, useEffect } from 'react';

import { stateMachine } from '../machines/state';
import { roomMachine } from '../machines/room';
import { userMachine } from '../machines/user';
import { meshMachine } from '../machines/mesh';
import { useRoomService } from '../hooks/useRoomService';
import { useUserService } from '../hooks/useUserService';
import { useMeshService } from '../hooks/useMeshService';

import type { PropsWithChildren } from 'react';
import type { InterpreterFrom } from 'xstate';
import { useInterpret, useSelector } from '@xstate/react';
import { SocketContext } from './SocketProvider';


const MachineContext = createContext({
	stateService: {} as InterpreterFrom<typeof stateMachine>,
	roomService: {} as InterpreterFrom<typeof roomMachine>,
	userService: {} as InterpreterFrom<typeof userMachine>,
	meshService: {} as InterpreterFrom<typeof meshMachine>
});

const MachineProvider = ({ children }: PropsWithChildren) => {
	const roomService = useRoomService();
	const userService = useUserService();
	const meshService = useMeshService();

	// 
	const socket = useContext(SocketContext);
	const stateService = useInterpret(stateMachine, {

	});

	const handleConnected = useCallback(({ userId }: any) => {
		stateService.send({ type: "CONNECTED", userId });
	}, []);

	useEffect(() => {
		socket.subscribe("Connected", handleConnected);
	}, []);
	// 

	const state = useSelector(stateService, (state) => state.value)

	return (
		<>
			{state}
			<MachineContext.Provider value={{ stateService, roomService, userService, meshService }}>
				{children}
			</MachineContext.Provider>
		</>
	);
};

export { MachineContext, MachineProvider }