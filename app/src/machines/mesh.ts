import { createMachine, assign } from "xstate";
import { createPeerService } from "./peer";

type Mesh = Map<string, ReturnType<typeof createPeerService>>;

export interface MeshContext {
	mesh: Mesh;
}

type MeshEvent =
	| { type: "ADD_TO_MESH"; userId: string; roomId: string; initiate: boolean }
	| { type: "REMOVE_FROM_MESH"; userId: string }
	| { type: "CLEAR" }
	| { type: "SEND_DATA"; data: any };

export const meshMachine = createMachine(
	{
		tsTypes: {} as import("./mesh.typegen").Typegen0,
		predictableActionArguments: true,
		context: {
			mesh: new Map<string, ReturnType<typeof createPeerService>>(),
		},
		schema: {
			context: {} as MeshContext,
			events: {} as MeshEvent,
		},
		initial: "empty",
		states: {
			empty: {
				always: {
					cond: "isNotEmpty",
					target: "active",
				},
				on: {
					ADD_TO_MESH: {
						actions: "addToMesh",
					},
				},
			},
			active: {
				always: {
					cond: "isEmpty",
					target: "empty",
				},
				on: {
					ADD_TO_MESH: {
						actions: "addToMesh",
					},
					REMOVE_FROM_MESH: {
						actions: "removeFromMesh",
					},
					CLEAR: {
						actions: "clear",
					},
					SEND_DATA: {
						actions: "sendData",
					},
				},
			},
		},
	},
	{
		guards: {
			isEmpty: (context) => context.mesh.size === 0,
			isNotEmpty: (context) => context.mesh.size !== 0,
		},
		actions: {
			// clear: () => {},
			addToMesh: assign({
				mesh: (context, event) => {
					if (context.mesh.has(event.userId)) {
						console.warn("Already in mesh!");
						return context.mesh;
					}
					const peer = createPeerService(
						event.userId,
						event.roomId,
						event.initiate
					);
					peer.start();

					return new Map<string, ReturnType<typeof createPeerService>>(
						context.mesh
					).set(event.userId, peer);
				},
			}),
			removeFromMesh: assign({
				mesh: (context, event) => {
					if (context.mesh.has(event.userId)) {
						const newMesh = new Map<
							string,
							ReturnType<typeof createPeerService>
						>(context.mesh);
						newMesh.get(event.userId)?.send("DISCONNECT");
						newMesh.delete(event.userId);
						return newMesh;
					}
					return context.mesh;
				},
			}),
			clear: assign({
				mesh: (context, event) => {
					context.mesh.forEach((peer) => peer.send("DISCONNECT"));
					return new Map<string, ReturnType<typeof createPeerService>>();
				},
			}),
			sendData: (context, event) => {
				context.mesh.forEach((value) => {
					value.send({
						type: "CHANNEL_SEND",
						data: event.data,
					});
				});
			},
		},
	}
);
