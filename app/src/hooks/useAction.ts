import { useSelector } from "@xstate/react";
import { useFeedContext } from "../context/FeedContext";
import { useMeshContext } from "../context/MeshContext";
import { useRoomContext } from "../context/RoomContext";
import { PeerAction, PeerActionData, PeerActionType } from "../models/actions";

const usePeerAction = <T extends PeerActionType>(type: T) => {
	const feedContext = useFeedContext();
	const meshContext = useMeshContext();
	const roomContext = useRoomContext();
	const userId = useSelector(roomContext, (state) => state.context.userId);

	const execute = (data?: PeerActionData<T>) => {
		const action: PeerAction = {
			type,
			createdAt: new Date(),
			createdBy: userId,
			data: { ...data },
		};

		feedContext.send({
			type: "ADD_ACTION",
			action,
		});
		meshContext.send({
			type: "SEND_ACTION",
			action,
		});

		return action;
	};

	return execute;
};

export { usePeerAction };
