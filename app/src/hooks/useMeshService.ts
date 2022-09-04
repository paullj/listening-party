import { useInterpret } from "@xstate/react";

import { meshMachine } from "../machines/mesh";
import { useCallback, useContext, useEffect } from "react";
import {
	Callback,
	SocketContext,
} from "../components/providers/SocketProvider";

const useMeshService = () => {
	const meshService = useInterpret(meshMachine, {});
	const socket = useContext(SocketContext);

	const handleJoinSuccesful = useCallback<Callback<"JoinSuccesful">>(
		({ connections, roomId }) => {
			connections.forEach((userId) =>
				meshService.send({
					type: "ADD_TO_MESH",
					userId,
					roomId,
					initiate: false,
				})
			);
		},
		[]
	);

	const handleAddPeer = useCallback<Callback<"AddPeer">>(
		({ userId, roomId }) => {
			meshService.send({ type: "ADD_TO_MESH", userId, roomId, initiate: true });
		},
		[]
	);

	const handleRemovePeer = useCallback<Callback<"RemovePeer">>(({ userId }) => {
		meshService.send({ type: "REMOVE_FROM_MESH", userId });
	}, []);

	useEffect(() => {
		socket.subscribe("JoinSuccesful", handleJoinSuccesful);
		socket.subscribe("AddPeer", handleAddPeer);
		socket.subscribe("RemovePeer", handleRemovePeer);
	}, [socket, handleJoinSuccesful, handleAddPeer, handleRemovePeer]);

	return meshService;
};

export { useMeshService };
