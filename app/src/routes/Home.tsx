import { useContext, useEffect, useState } from 'react';

import { MachineContext } from '../components/providers/MachineProvider';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/common/Button';
import useDigitInput from '../hooks/useDigitInput';

import type { FormEventHandler } from "react";

const Home = () => {
	const [roomId, setRoomId] = useState("abc123");

	const digits = useDigitInput({
		acceptedCharacters: /^[aA-zZ0-9]$/,
		length: 6,
		value: roomId,
		onChange: setRoomId,
	});

	const { stateService } = useContext(MachineContext);

	useEffect(() => {
		// roomService.start("welcome");
	}, []);

	const handleCreateRoom: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		stateService.send("CREATE_ROOM");
	}
	const handleJoinRoom: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		stateService.send({ type: "JOIN_ROOM", roomId });
	}

	return (
		<div className="max-w-sm flex flex-col">
			<div className="flex-none">
				<ErrorMessage />
			</div>

			<div className='flex-full flex flex-col items-center justify-center'>
				<form onSubmit={handleJoinRoom} className="space-x-2">
					<div className="font-mono text-xl inline-flex flex-row justify-around space-x-1">
						{digits.map((digit, i) =>
							<input key={i} size={1} placeholder="x" className="lowercase text-center text-white box-border border-4 border-gray-400 bg-gray-400 px-1.5 py-0.5 rounded-lg" autoFocus={i === 0} inputMode="text" {...digit} />)}
					</div>
					<Button>Join Room</Button>
				</form>

				<div className='flex mt-4 space-x-2 items-center'>
					<p className='leading-none text-right font-light'>Enter code above to join existing room or create a new room</p>
					<form onSubmit={handleCreateRoom} >
						<Button>Create Room</Button>
					</form>
				</div>
			</div>
		</div>

	)
}

export default Home