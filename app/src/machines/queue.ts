import { assign, createMachine } from "xstate";
import type {
	PeerAction,
	PeerActionData,
	WithIdentifier,
} from "../models/actions";
import type { Track } from "../models/track";

interface QueueContext {
	history: WithIdentifier<Track>[];
	nowPlaying: WithIdentifier<Track> | null;
	queue: WithIdentifier<Track>[];
}

type QueueEvent =
	| {
			type: "ADD_TO_QUEUE";
			action: PeerAction;
	  }
	| {
			type: "REMOVE_FROM_QUEUE";
			action: PeerAction;
	  }
	| { type: "NEXT_TRACK" }
	| { type: "PREV_TRACK" };

interface QueueSchema {
	context: QueueContext;
	events: QueueEvent;
}

const initialContext: QueueContext = {
	history: [],
	nowPlaying: null,
	queue: [],
};

const queueMachine = createMachine(
	{
		id: "queue",
		context: initialContext,
		tsTypes: {} as import("./queue.typegen").Typegen0,
		schema: {} as QueueSchema,
		initial: "empty",
		predictableActionArguments: true,
		on: {
			ADD_TO_QUEUE: {
				actions: "addToQueue",
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
				on: {
					PREV_TRACK: {
						cond: "hasHistory",
						actions: "previousTrack",
					},
					NEXT_TRACK: {
						cond: "hasQueue",
						actions: "nextTrack",
					},
				},
			},
		},
	},
	{
		guards: {
			hasQueue: (context) => context.queue.length > 0,
			hasHistory: (context) => context.history.length > 0,
			isNotEmpty: (context) =>
				context.nowPlaying !== null || context.queue.length > 0,
			isEmpty: (context) =>
				context.nowPlaying === null && context.queue.length === 0,
		},
		services: {},
		actions: {
			addToQueue: assign((context, event) => {
				const track: WithIdentifier<Track> = {
					...(event.action.data as PeerActionData<"AddTrackToQueue">),
					createdAt: event.action.createdAt,
					createdBy: event.action.createdBy,
				};
				if (context.nowPlaying === null) {
					return {
						...context,
						nowPlaying: track,
					};
				} else {
					return {
						...context,
						queue: [...context.queue, track],
					};
				}
			}),
			previousTrack: assign((context) => ({
				queue: context.nowPlaying
					? [context.nowPlaying, ...context.queue]
					: context.queue,
				nowPlaying: context.history[0],
				history: context.history.slice(1),
			})),
			nextTrack: assign((context) => ({
				queue: context.queue.slice(1),
				nowPlaying: context.queue[0],
				history: context.nowPlaying
					? [context.nowPlaying, ...context.history]
					: context.history,
			})),
		},
	}
);

export { queueMachine };
export type { QueueContext, QueueEvent };
