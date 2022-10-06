import { createMachine, assign } from "xstate";
import { Mesh } from "../models/mesh";
import { Peer } from "../models/peer";
import { clearMesh, removeFromMesh } from "./mesh";

interface StateContext {
	userId: string;
	roomId: string;
	roomName: string;
	mesh: Mesh;
}

type StateEvent =
	| { type: "ERROR"; message: string }
	| { type: "RESET" }
	| { type: "RETRY" }
	| { type: "SUCCESS"; roomId?: string; roomName?: string }
	| { type: "SET_USER_ID"; userId: string }
	| { type: "JOIN_ROOM"; roomId: string }
	| { type: "CREATE_ROOM" }
	| { type: "ADD_TO_ROOM"; userId: string; initiate: boolean }
	| { type: "REMOVE_FROM_ROOM"; userId: string }
	| { type: "RECIEVE_OFFER"; userId: string; offer: RTCSessionDescriptionInit }
	| {
			type: "RECIEVE_ANSWER";
			userId: string;
			answer: RTCSessionDescriptionInit;
	  }
	| { type: "RECIEVE_CANDIDATE"; userId: string; candidate: RTCIceCandidate }
	| { type: "SEND_DATA"; data: any }
	| { type: "LEAVE_ROOM" };

interface StateSchema {
	context: StateContext;
	events: StateEvent;
}

const initialContext: StateContext = {
	roomId: "abc123",
	userId: "",
	roomName: "",
	mesh: new Map<string, Peer>(),
};

const stateMachine = createMachine(
	{
		id: "state",
		context: initialContext,
		tsTypes: {} as import("./state.typegen").Typegen0,
		schema: {} as StateSchema,
		initial: "initial",
		predictableActionArguments: true,
		on: {
			RESET: { target: "idle", actions: "navigateToHome" },
		},
		states: {
			initial: {
				after: {
					3000: { target: "failure.signal" },
				},
				on: {
					SET_USER_ID: { target: "idle", actions: ["setUserId"] },
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
				entry: "navigateToRoom",
				initial: "empty",
				on: {
					ADD_TO_ROOM: {
						actions: "addToMesh",
					},
					LEAVE_ROOM: {
						target: "idle",
						actions: ["sendLeaveRoom", "navigateToHome"],
					},
					RECIEVE_OFFER: {
						actions: "recieveOffer",
					},
				},
				states: {
					empty: {
						always: { cond: "roomIsNotEmpty", target: "active" },
					},
					active: {
						on: {
							REMOVE_FROM_ROOM: {
								actions: "removeFromMesh",
							},
							RECIEVE_ANSWER: {
								actions: "recieveAnswer",
							},
							RECIEVE_CANDIDATE: {
								actions: "recieveCandidate",
							},
							SEND_DATA: {
								actions: "sendData",
							},
						},
					},
				},
				exit: "clearMesh",
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
				history: "shallow",
			},
		},
	},
	{
		guards: {
			roomIsNotEmpty: (context) => context.mesh.size > 0,
		},
		services: {},
		actions: {
			setUserId: assign({ userId: (_, event) => event.userId }),
			setRoomId: assign({ roomId: (_, event) => event.roomId! }),
			setRoomName: assign({ roomName: (_, event) => event.roomName! }),
			removeFromMesh: assign({
				mesh: (context, event) => removeFromMesh(context.mesh, event.userId),
			}),
			clearMesh: assign({ mesh: (context) => clearMesh(context.mesh) }),
			sendData: (context, event) => {
				context.mesh.forEach((peer) => {
					if (peer.channel.readyState === "open") {
						peer.channel.send(
							JSON.stringify({
								...event.data,
								created: new Date().toISOString(),
								userId: context.userId,
							})
						);
					}
				});
			},
		},
	}
);

export { stateMachine };
export type { StateContext, StateEvent };
