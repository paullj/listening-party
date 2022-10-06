import { createContext, useContext } from 'react';
import { useInterpret } from '@xstate/react';
import { queueMachine } from '../machines/queue';

import type { PropsWithChildren } from 'react';
import type { InterpreterFrom } from 'xstate';

type QueueInterpreter = InterpreterFrom<typeof queueMachine>;

const QueueContext = createContext(
	{} as QueueInterpreter
);

const QueueProvider = ({ children }: PropsWithChildren) => {
	const queueService = useInterpret(queueMachine, {
	});


	return (
		<>
			<QueueContext.Provider value={queueService}>
				{children}
			</QueueContext.Provider>
		</>
	);
};

const useQueueContext = () => useContext(QueueContext);

export { QueueContext, QueueProvider, useQueueContext };
export type { QueueInterpreter };