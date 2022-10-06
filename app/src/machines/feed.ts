import { assign, createMachine } from "xstate";
import { PeerAction } from "../models/actions";

interface FeedContext {
	count: number;
	offset: number;
	feed: PeerAction[];
}

type FeedEvent =
	| { type: "OPEN_FEED" }
	| { type: "CLOSE_FEED" }
	| { type: "ADD_ACTION"; action: PeerAction };

interface FeedSchema {
	context: FeedContext;
	events: FeedEvent;
}

const initialContext: FeedContext = {
	count: 0,
	offset: 0,
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
					ADD_ACTION: {
						actions: ["addAction", "addUnread"],
					},
				},
			},
			open: {
				initial: "empty",
				on: {
					CLOSE_FEED: {
						target: "closed",
					},
					ADD_ACTION: {
						actions: ["addAction", "addOffset"],
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
			addAction: assign({
				feed: (context, event) => {
					const action: PeerAction = event.action;
					return [action, ...context.feed];
				},
			}),
			markRead: assign({
				count: (_context, _event) => 0,
				offset: (_context, _event) => 0,
			}),
		},
	}
);

export { feedMachine };
export type { FeedContext, FeedEvent };
