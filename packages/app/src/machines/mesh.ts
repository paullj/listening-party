import { createMachine, assign } from "xstate";
import { PeerAction } from "../models/actions";
import type { Mesh } from "../models/mesh";
import type { Peer } from "../models/peer";

interface MeshContext {
	mesh: Mesh;
}

type MeshEvent =
	| { type: "CLEAR_MESH" }
	| { type: "ADD_PEER"; userId: string; initiate: boolean }
	| { type: "REMOVE_PEER"; userId: string }
	| { type: "RECIEVE_OFFER"; userId: string; offer: RTCSessionDescriptionInit }
	| {
			type: "RECIEVE_ANSWER";
			userId: string;
			answer: RTCSessionDescriptionInit;
	  }
	| { type: "RECIEVE_CANDIDATE"; userId: string; candidate: RTCIceCandidate }
	| { type: "SEND_ACTION"; userId: string; action: PeerAction }
	| { type: "BROADCAST_ACTION"; action: PeerAction };

interface MeshSchema {
	context: MeshContext;
	events: MeshEvent;
}

const initialContext: MeshContext = {
	mesh: new Map<string, Peer>(),
};

const meshMachine = createMachine(
	{
		id: "mesh",
		context: initialContext,
		tsTypes: {} as import("./mesh.typegen").Typegen0,
		schema: {} as MeshSchema,
		predictableActionArguments: true,
		initial: "empty",
		on: {
			CLEAR_MESH: {
				actions: "clearMesh",
			},
			ADD_PEER: {
				actions: "addToMesh",
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
					REMOVE_PEER: {
						actions: "removeFromMesh",
					},
					RECIEVE_ANSWER: {
						actions: "recieveAnswer",
					},
					RECIEVE_CANDIDATE: {
						actions: "recieveCandidate",
					},
					SEND_ACTION: {
						actions: "sendAction",
					},
					BROADCAST_ACTION: {
						actions: "broadcastAction",
					},
				},
			},
		},
	},
	{
		guards: {
			roomIsNotEmpty: (context) => context.mesh.size > 0,
		},
		services: {},
		actions: {
			removeFromMesh: assign({
				mesh: (context, event) => removeFromMesh(context.mesh, event.userId),
			}),
			clearMesh: assign({ mesh: (context) => clearMesh(context.mesh) }),
			recieveAnswer: (context, event) => {
				if (context.mesh.has(event.userId)) {
					const { connection } = context.mesh.get(event.userId)!;
					if (!connection.remoteDescription)
						connection.setRemoteDescription(event.answer).catch((err) => {
							console.error("Answer recieve error!");
						});
				}
			},
			recieveCandidate: (context, event) => {
				if (context.mesh.has(event.userId)) {
					const { connection } = context.mesh.get(event.userId)!;
					connection.addIceCandidate(event.candidate).catch((err) => {
						console.error("Candidate recieve error!");
					});
				}
			},
		},
	}
);

const removeFromMesh = (mesh: Mesh, userToRemove: string) => {
	if (!mesh.has(userToRemove)) return mesh;

	const newMesh = new Map<string, Peer>(mesh);
	const { connection, channel } = mesh.get(userToRemove)!;

	channel.close();
	connection.close();
	newMesh.delete(userToRemove);
	return newMesh;
};

const clearMesh = (mesh: Mesh) => {
	mesh.forEach((peer) => {
		peer.channel.close();
		peer.connection.close();
	});
	mesh.clear();
	return mesh;
};

export { meshMachine };
export type { MeshContext, MeshEvent };
