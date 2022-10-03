import type { Peer } from "../models/peer";
import type { Mesh } from "../models/mesh";

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

export { removeFromMesh, clearMesh };
