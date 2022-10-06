import { createContext, useContext } from "react";
import { useInterpret } from "@xstate/react";
import { feedMachine } from "../machines/feed";

import type { PropsWithChildren } from "react";
import type { InterpreterFrom } from "xstate";

type FeedInterpreter = InterpreterFrom<typeof feedMachine>;

const FeedContext = createContext({} as FeedInterpreter);

const FeedProvider = ({ children }: PropsWithChildren) => {
	const feedService = useInterpret(feedMachine, {});

	return (
		<>
			<FeedContext.Provider value={feedService}>
				{children}
			</FeedContext.Provider>
		</>
	);
};

const useFeedContext = () => useContext(FeedContext);

export { FeedContext, FeedProvider, useFeedContext };
export type { FeedInterpreter };
