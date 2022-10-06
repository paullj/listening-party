import { assign, createMachine } from "xstate";
import { Message, Track, Vote } from "../models/RTCData";

interface FeedContext {
	feed: (Track | Message | Vote)[];
}

type FeedEvent =
	| { type: "ADD_TRACK"; track: Track }
	| { type: "ADD_MESSAGE"; message: Message }
	| { type: "ADD_VOTE"; vote: Vote };

interface FeedSchema {
	context: FeedContext;
	events: FeedEvent;
}

const initialContext: FeedContext = {
	feed: [],
};

const feedMachine = createMachine(
	{
		id: "feed",
		context: initialContext,
		tsTypes: {} as import("./feed.typegen").Typegen0,
		schema: {} as FeedSchema,
		initial: "empty",
		predictableActionArguments: true,
		on: {
			ADD_MESSAGE: {
				actions: "addMessage",
			},
		},
		states: {
			empty: {
				always: {
					target: "active",
					cond: "isNotEmpty",
				},
			},
			active: {
				always: {
					target: "empty",
					cond: "isEmpty",
				},
				on: {},
			},
		},
	},
	{
		guards: {
			isNotEmpty: (context) => context.feed.length > 0,
			isEmpty: (context) => context.feed.length === 0,
		},
		services: {},
		actions: {
			addMessage: assign({
				feed: (context, event) => [event.message, ...context.feed],
			}),
		},
	}
);

export { feedMachine };
export type { FeedContext, FeedEvent };
