import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "@xstate/react";
import { MachineContext } from "../components/providers/MachineProvider";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

import type { FormEventHandler, ChangeEventHandler } from "react";

const Room = () => {
	const { id } = useParams();
	const { stateService } = useContext(MachineContext)

	const { roomId, roomName } = useSelector(stateService, (state) => state.context);
	const mesh = useSelector(stateService, (state) => [...state.context.mesh.values()]);
	const hasJoined = useSelector(stateService, (state) => state.matches("room"));
	const hasFailed = useSelector(stateService, (state) => state.matches("failure"));

	const [message, setMessage] = useState("Hi!");


	const handleChangeMessage: ChangeEventHandler<HTMLInputElement> = async (event) => {
		setMessage(event?.currentTarget.value)
	}

	const handleSend: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		stateService.send({
			type: "SEND_DATA",
			data: {
				message
			}
		});
		setMessage('');
	}

	useEffect(() => {
		if (!hasJoined && id) {
			const listener = (state: any) => {
				if (state.matches("idle")) {
					stateService.send({ type: "JOIN_ROOM", roomId: id });
					stateService.off(listener);
				}
			};
			stateService.onTransition(listener)
		}
	}, [id, stateService]);

	if (hasFailed) {
		return (
			<div>
				<button className="button-red" onClick={() => { stateService.send("RETRY") }}>Retry</button>
				<button className="button-red" onClick={() => { stateService.send("RESET") }}>Back</button>
			</div>
		)
	}
	else {
		return (
			<div>
				<button className="button-red" onClick={() => stateService.send("LEAVE_ROOM")}>Leave</button>
				<div>
					<p>Room ID: <span className="font-mono">
						{roomId}
					</span>
					</p>
					<p>Room Name: {roomName}</p>
				</div>
				<div>
					<p className="mt-2 underline">Peers ({mesh.length})</p>
					<ul>
						{mesh.map(({ userId, connection, channel }) =>
							<li key={userId}>
								<span className="font-mono">{userId.slice(0, 6)}</span>
								{`(${connection.signalingState} -> ${connection.iceConnectionState} -> ${channel.readyState})`}
							</li>)}
					</ul>
				</div>

				<div>
					<form onSubmit={handleSend} >
						<Input type="text" value={message} onChange={handleChangeMessage}></Input>
						<Button>Send</Button>
					</form>
				</div>
			</div>

		)
	}
}

export default Room;