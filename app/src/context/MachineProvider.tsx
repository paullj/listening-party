import { createContext } from 'react';
import { InterpreterFrom } from 'xstate';
import { stateMachine } from '../machines/state';

import type { PropsWithChildren } from 'react';

import { useSocketReciever } from '../hooks/useSocketReciever';
import { useStateService } from '../hooks/useStateService';

const MachineContext = createContext({
	stateService: {} as InterpreterFrom<typeof stateMachine>,
});

const MachineProvider = ({ children }: PropsWithChildren) => {
	const stateService = useStateService();

	useSocketReciever(stateService);

	return (
		<>
			<MachineContext.Provider value={{ stateService }}>
				{children}
			</MachineContext.Provider>
		</>
	);
};


export { MachineContext, MachineProvider }