import { createContext, useContext } from 'react';
import { InterpreterFrom } from 'xstate';
import { stateMachine } from '../machines/state';

import type { PropsWithChildren } from 'react';

import { useSocketReciever } from '../hooks/useSocketReciever';
import { useStateService } from '../hooks/useStateService';


const StateContext = createContext<InterpreterFrom<typeof stateMachine>>(
	{} as InterpreterFrom<typeof stateMachine>
);

const StateProvider = ({ children }: PropsWithChildren) => {
	const stateService = useStateService();
	useSocketReciever(stateService);

	return (
		<>
			<StateContext.Provider value={stateService}>
				{children}
			</StateContext.Provider>
		</>
	);
};

const useStateContext = () => useContext(StateContext)

export { StateContext, StateProvider, useStateContext }