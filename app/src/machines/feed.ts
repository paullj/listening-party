import { assign, createMachine } from "xstate";
import { Message, Track, Vote } from "../models/RTCData";

type Kind = "Track" | "Message" | "Vote";
type WithKind<K> = K & { kind: Kind };

interface FeedContext {
	unread: number;
	feed: WithKind<Track | Message | Vote>[];
}

type FeedEvent =
	| { type: "OPEN_FEED" }
	| { type: "CLOSE_FEED" }
	| { type: "ADD_TRACK"; track: Track }
	| { type: "ADD_MESSAGE"; message: Message }
	| { type: "ADD_VOTE"; vote: Vote };

interface FeedSchema {
	context: FeedContext;
	events: FeedEvent;
}

const initialContext: FeedContext = {
	unread: 0,
	feed: [],
};

const feedMachine = createMachine(
	{
		id: "feed",
		context: initialContext,
		tsTypes: {} as import("./feed.typegen").Typegen0,
		schema: {} as FeedSchema,
		initial: "closed",
		predictableActionArguments: true,
		states: {
			closed: {
				on: {
					OPEN_FEED: {
						target: "open",
					},
					ADD_MESSAGE: {
						actions: ["addMessage", "addUnread"],
					},
				},
			},
			open: {
				on: {
					CLOSE_FEED: {
						target: "closed",
					},
					ADD_MESSAGE: {
						actions: ["addMessage"],
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
					},
				},
				exit: "markRead",
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
				feed: (context, event) => {
					const message: WithKind<Message> = {
						kind: "Message",
						...event.message,
					};
					return [message, ...context.feed];
				},
			}),
			addUnread: assign({
				unread: (context, _event) =>
					context.unread === 0 ? 1 : context.unread + 1,
			}),
			markRead: assign({
				unread: (_context, _event) => 0,
			}),
		},
	}
);

export { feedMachine };
export type { FeedContext, FeedEvent };
