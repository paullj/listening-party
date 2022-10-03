import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "@xstate/react";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { MachineContext } from "../context/MachineProvider";

import type { FormEventHandler, ChangeEventHandler } from "react";

const Room = () => {
	const { id } = useParams();
	const { stateService } = useContext(MachineContext)

	const { roomId, roomName } = useSelector(stateService, (state) => state.context);
	const mesh = useSelector(stateService, (state) => [...state.context.mesh.values()]);
	const messages = useSelector(stateService, (state) => state.context.messages);
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
				content: message,
				date: new Date().toISOString()
			}
		});
		stateService.send({
			type: "ADD_MESSAGE",
			content: message,
			created: new Date(),
			userId: "hi"
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
			stateService.onTransition(listener);
		}
	}, [id, stateService]);

	if (hasFailed) {
		return (
			<div>
				<Button color="red" onClick={() => { stateService.send("RETRY") }}>Retry</Button>
				<Button color="red" onClick={() => { stateService.send("RESET") }}>Back</Button>
			</div>
		)
	}
	else {
		return (
			<div>
				<Button color="red" onClick={() => stateService.send("LEAVE_ROOM")}>Leave</Button>
				<div className="mt-8">
					<p className="text-2xl font-light align-center">
						<span className="mr-2">
							{roomName}
						</span>
						<span className="font-mono text-base">
							({roomId})
						</span>
					</p>
				</div>
				<div className="mt-4">
					<p className="">Peers ({mesh.length})</p>
					<ul>
						{mesh.map(({ userId, connection, channel }) =>
							<li key={userId}>
								<span className="font-mono">{userId.slice(0, 6)}</span>
								{`(${connection.signalingState} -> ${connection.iceConnectionState} -> ${channel.readyState})`}
							</li>)}
					</ul>
				</div>

				<ul>
					{messages.map(({ userId, content, created }) =>
						<li key={created.toISOString()}>
							{content}
						</li>)}
				</ul>

				<div className="mt-4">
					<form onSubmit={handleSend} className="space-x-1">
						<Input type="text" value={message} onChange={handleChangeMessage}></Input>
						<Button>Send</Button>
					</form>

				</div>
			</div>

		)
	}
}

export default Room;