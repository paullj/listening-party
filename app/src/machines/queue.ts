import { assign, createMachine } from "xstate";
import { Track } from "../models/RTCData";

interface QueueContext {
	history: Track[];
	nowPlaying: Track | null;
	queue: Track[];
}

type QueueEvent =
	| ({ type: "ADD_TO_QUEUE" } & Omit<Track, "id">)
	| { type: "REMOVE_FROM_QUEUE"; id: string };

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
					cond: "isEmpty",
				},
			},
			active: {},
		},
	},
	{
		guards: {
			isEmpty: (context) =>
				context.nowPlaying !== null || context.queue.length > 0,
		},
		services: {},
		actions: {
			addToQueue: assign((context, event) => {
				if (context.nowPlaying === null) return {};
			}),
		},
	}
);

export { queueMachine };
export type { QueueContext, QueueEvent };
