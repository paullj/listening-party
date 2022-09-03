import { createMachine, assign } from "xstate";

export interface UserContext {
	userId: string;
}

type UserEvent = {
	type: "CONNECT";
	userId: string;
};

export const userMachine = createMachine(
	{
		tsTypes: {} as import("./user.typegen").Typegen0,
		predictableActionArguments: true,
		context: { userId: "" },
		schema: {
			context: {} as UserContext,
			events: {} as UserEvent,
		},
		id: "user",
		initial: "disconnected",
		states: {
			connected: {},
			disconnected: {
				on: {
					CONNECT: { target: "connected", actions: ["setUserId"] },
				},
			},
		},
	},
	{
		actions: {
			setUserId: assign({
				userId: (_, event) => event.userId,
			}),
		},
	}
);
