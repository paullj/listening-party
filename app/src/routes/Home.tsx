import { useContext, useEffect, useState } from 'react';
import { MachineContext } from '../providers/MachineProvider';

import type { ChangeEventHandler, FormEventHandler } from "react";

const Home = () => {
	const [roomId, setRoomId] = useState("");
	const { roomService } = useContext(MachineContext);

	useEffect(() => {
		roomService.start("welcome");
	}, []);

	const handleRoomIDChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		setRoomId(event.currentTarget.value);
	}

	const handleCreateRoom: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		roomService.send("CREATE_ROOM");
	}
	const handleJoinRoom: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		roomService.send({ type: "JOIN_ROOM", roomId });
	}

	return (
		<>
			<form onSubmit={handleCreateRoom}>
				<button className="button">Create Room</button>
			</form>

			<form onSubmit={handleJoinRoom}>
				<input type="text" value={roomId} placeholder="Enter Room ID" onChange={(e) => handleRoomIDChange(e)} minLength={6} maxLength={6} required={true} />
				<button className="button">Join Room</button>
			</form>
		</>
	)
}

export default Home