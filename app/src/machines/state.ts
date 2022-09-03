import { createMachine, assign, send, actions } from "xstate";

interface StateContext {
	userId: string;
	roomId: string;
	roomName: string;
}

type StateEvent =
	| { type: "CONNECTED"; userId: string }
	| { type: "ERROR"; message: string };

interface StateSchema {
	context: StateContext;
	events: StateEvent;
}

const initialContext: StateContext = {
	userId: "",
	roomId: "",
	roomName: "",
};

const stateMachine = createMachine(
	{
		id: "room",
		context: initialContext,
		tsTypes: {} as import("./state.typegen").Typegen0,
		schema: {} as StateSchema,
		initial: "initial",
		predictableActionArguments: true,
		states: {
			initial: {
				always: { target: "idle", cond: "isConnected" },
				on: {
					CONNECTED: { actions: ["setUserId"] },
				},
			},
			idle: {},
			error: {},
		},
	},
	{
		guards: {
			isConnected: (context) => !context.userId,
		},
		services: {},
		actions: {
			setUserId: assign({ userId: (_, event) => event.userId }),
		},
	}
);

export { stateMachine };
export type { StateContext, StateEvent };
