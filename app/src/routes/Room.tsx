import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "@xstate/react";
import { MachineContext } from "../providers/MachineProvider";
import MeshInfo from "../components/MeshInfo";
import Chat from "../components/Chat";

const Room = () => {
	const { id } = useParams();
	const { roomService } = useContext(MachineContext);
	const { roomId, roomName } = useSelector(roomService, (state) => state.context);
	const hasJoined = useSelector(roomService, (state) => state.matches("room"));
	const hasFailed = useSelector(roomService, (state) => state.matches("failure"));

	useEffect(() => {
		if (!hasJoined && id) {
			roomService.send({ type: "JOIN_ROOM", roomId: id });
		}
	}, [id]);

	if (hasFailed) {
		return (
			<div>
				<button className="button-red" onClick={() => { roomService.send("RETRY") }}>Retry</button>
				<button className="button-red" onClick={() => { roomService.send("RESET") }}>Back</button>
			</div>
		)
	}
	else {
		return (
			<div>
				<button className="button-red" onClick={() => { roomService.send("LEAVE") }}>Leave</button>
				<div>
					<p>Room ID: {roomId}</p>
					<p>Room Name: {roomName}</p>
				</div>

				<MeshInfo></MeshInfo>

				<Chat></Chat>
			</div>

		)
	}
}

export default Room;