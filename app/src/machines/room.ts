import { createMachine, assign } from "xstate";

interface RoomContext {
	userId: string;
	roomId: string;
	roomName: string;
}

type RoomEvent =
	| { type: "ERROR"; message: string }
	| { type: "RESET" }
	| { type: "RETRY" }
	| { type: "SUCCESS"; roomId?: string; roomName?: string }
	| { type: "SET_USER_ID"; userId: string }
	| { type: "JOIN_ROOM"; roomId: string }
	| { type: "CREATE_ROOM" }
	| { type: "LEAVE_ROOM" };

interface RoomSchema {
	context: RoomContext;
	events: RoomEvent;
}

const initialContext: RoomContext = {
	roomId: "abc123",
	userId: "",
	roomName: "",
};

const roomMachine = createMachine(
	{
		id: "room",
		context: initialContext,
		tsTypes: {} as import("./room.typegen").Typegen0,
		schema: {} as RoomSchema,
		initial: "initial",
		predictableActionArguments: true,
		on: {
			RESET: { target: "initial", actions: "navigateToHome" },
		},
		states: {
			initial: {
				entry: "tryToConnect",
				after: {
					3000: { target: "failure.signal" },
				},
				always: {
					cond: "hasUserId",
					target: "idle",
				},
				on: {
					SET_USER_ID: { actions: ["setUserId"] },
				},
			},
			idle: {
				on: {
					JOIN_ROOM: { target: "join", actions: "setRoomId" },
					CREATE_ROOM: { target: "create" },
				},
			},
			join: {
				entry: "sendJoinRoom",
				after: {
					3000: { target: "failure.join" },
				},
				on: {
					ERROR: { target: "failure.join" },
					SUCCESS: { target: "room", actions: "setRoomName" },
				},
			},
			create: {
				entry: "sendCreateRoom",
				after: {
					3000: { target: "failure.create" },
				},
				on: {
					ERROR: { target: "failure.create" },
					SUCCESS: { target: "join", actions: "setRoomId" },
				},
			},
			room: {
				entry: ["navigateToRoom", "getConnections"],
				on: {
					LEAVE_ROOM: {
						target: "idle",
						actions: ["sendLeaveRoom", "navigateToHome"],
					},
				},
			},
			failure: {
				entry: "navigateToError",
				initial: "default",
				states: {
					default: {
						meta: "An unknown error has occured!",
					},
					signal: {
						meta: "The signalling server can not be reached!",
						on: {
							RESET: {
								target: "#room.initial",
							},
						},
					},
					join: {
						meta: "Could not join room!",
					},
					create: {
						meta: "Could not create room!",
					},
				},
				on: {
					RETRY: "back",
				},
			},
			back: {
				type: "history",
				history: "deep",
			},
		},
	},
	{
		guards: {
			hasUserId: (context) => context.userId.trim() !== "",
		},
		services: {},
		actions: {
			setUserId: assign({ userId: (_, event) => event.userId }),
			setRoomId: assign({ roomId: (_, event) => event.roomId! }),
			setRoomName: assign({ roomName: (_, event) => event.roomName! }),
		},
	}
);

export { roomMachine };
export type { RoomContext, RoomEvent };
