import { ChangeEventHandler, useContext, useState } from 'react';

import useDigitInput from '../hooks/useDigitInput';

import { MachineContext } from '../context/MachineProvider';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

import type { FormEventHandler } from "react";
import { useSelector } from '@xstate/react';

const Home = () => {
	const { stateService } = useContext(MachineContext);
	const initialRoomId = useSelector(stateService, (state) => state.context.roomId);
	const isIdle = useSelector(stateService, (state) => state.matches("idle"));

	const [roomId, setRoomId] = useState(initialRoomId);

	const digits = useDigitInput({
		acceptedCharacters: /^[aA-zZ0-9]$/,
		length: 6,
		value: roomId,
		onChange: setRoomId,
	});

	const handleChangeRoomId: ChangeEventHandler<HTMLInputElement> = async (event) => {
		setRoomId(event.currentTarget.value);
	}
	const handleCreateRoom: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		stateService.send("CREATE_ROOM");
	}
	const handleJoinRoom: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		stateService.send({ type: "JOIN_ROOM", roomId });
	}

	return (
		<div className='flex flex-col space-y-4'>
			<p className='leading-none font-light'>Enter code to join existing room</p>
			<form onSubmit={handleJoinRoom} className="space-x-2 font-mono">
				{/* <Input size={6} maxLength={6} minLength={6} onChange={handleChangeRoomId} /> */}
				<div className="font-mono text-xl inline-flex flex-row justify-around space-x-1">
					{digits.map((digit, i) =>
						<input key={i} size={1} placeholder="x" className="lowercase text-center border-box text-gray-600 box-border border-4 border-gray-300 bg-gray-100 px-1.5 py-0.5 rounded" autoFocus={i === 0} inputMode="text" {...digit} disabled={!isIdle} />)}
				</div>
				<Button disabled={!isIdle}>Join Room</Button>
			</form>

			<div className='flex space-x-2 items-center'>
				<p className='leading-none text-right font-light'>or create a new room</p>
				<form onSubmit={handleCreateRoom}>
					<Button disabled={!isIdle}>Create Room</Button>
				</form>
			</div>
		</div>
	)
}

export default Home