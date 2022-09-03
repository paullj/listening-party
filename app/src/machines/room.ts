import { createMachine, assign, send, actions } from "xstate";
import { meshMachine } from "./mesh";

export interface RoomContext {
	roomId: string;
	roomName: string;
}

type RoomEvent =
	| { type: "ERROR"; message: string }
	| { type: "RESET" }
	| { type: "RETRY" }
	| { type: "JOIN_ROOM"; roomId: string }
	| { type: "JOIN_ROOM_SUCCESS"; roomId: string; roomName: string }
	| { type: "CREATE_ROOM"; roomName: string }
	| { type: "CREATE_ROOM_SUCCESS"; roomId: string }
	| { type: "LEAVE" }
	| { type: "ADD_TO_MESH" };

const childStates = {
	initial: "empty",
	states: {
		empty: {
			on: { ADD_TO_MESH: "full" },
		},
		full: {},
	},
};
export const roomMachine = createMachine(
	{
		context: { roomId: "", roomName: "" },
		tsTypes: {} as import("./room.typegen").Typegen0,
		schema: { context: {} as RoomContext, events: {} as RoomEvent },
		predictableActionArguments: true,
		id: "room",
		initial: "welcome",
		states: {
			welcome: {
				on: {
					JOIN_ROOM: {
						target: "join",
						actions: "setRoomId",
						cond: "test",
					},
					CREATE_ROOM: {
						target: "create",
					},
				},
			},
			join: {
				entry: "sendJoinRoom",
				on: {
					JOIN_ROOM_SUCCESS: {
						target: "room",
						actions: "setRoom",
					},
					ERROR: {
						target: "failure",
						actions: (_, event) => console.error(event.message),
					},
				},
			},
			create: {
				entry: "sendCreateRoom",
				on: {
					CREATE_ROOM_SUCCESS: {
						target: "join",
						actions: "setRoomId",
					},
					ERROR: {
						target: "failure",
						actions: (_, event) => console.error(event.message),
					},
				},
			},
			room: {
				entry: "navigateToRoom",
				invoke: {
					id: "mesh",
					src: meshMachine,
				},
				on: {
					LEAVE: {
						target: "leave",
						actions: "sendLeaveRoom",
					},
				},
			},
			leave: {
				// invoke: {
				// 	id: "mesh",
				// 	src: meshMachine,
				// },
				always: {
					target: "welcome",
					actions: "navigateToHome",
					// actions: send({ type: "CLEAR" }, { to: "mesh" }),
				},
			},
			failure: {
				on: {
					RETRY: {
						target: "back",
					},
					RESET: {
						target: "welcome",
						actions: "navigateToHome",
					},
				},
			},
			back: {
				type: "history",
				history: "shallow",
			},
		},
	},
	{
		guards: {
			test: (context, event) => true,
		},
		actions: {
			setRoomId: assign({
				roomId: (_, event) => event.roomId,
			}),
			setRoom: assign((_, event) => ({
				roomId: event.roomId,
				roomName: event.roomName,
			})),
		},
	}
);
