import { createContext, useContext } from "react";
import { useInterpret, useSelector } from "@xstate/react";
import { feedMachine } from "../machines/feed";

import type { PropsWithChildren } from "react";
import { assign, InterpreterFrom } from "xstate";
import { useRoomContext } from "./RoomContext";

type FeedInterpreter = InterpreterFrom<typeof feedMachine>;

const FeedContext = createContext({} as FeedInterpreter);

const FeedProvider = ({ children }: PropsWithChildren) => {
	const roomService = useRoomContext();
	const userId = useSelector(roomService, (state) => state.context.userId);

	const feedService = useInterpret(feedMachine, {
		actions: {
			addOffset: assign({
				offset: (context, event) =>
					event.action.data?.createdBy === userId
						? context.offset
						: context.offset + 1,
			}),
			addUnread: assign({
				count: (context, event) =>
					event.action.data?.createdBy === userId
						? context.count
						: context.count + 1,
			}),
		},
	});

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
