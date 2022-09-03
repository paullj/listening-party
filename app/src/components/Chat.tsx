import { useContext, useState } from 'react';

import type { ChangeEventHandler, FormEventHandler } from "react";
import { MachineContext } from '../providers/MachineProvider';

const Chat = () => {
	const [message, setMessage] = useState("abc123");
	const { meshService } = useContext(MachineContext);

	const handleMessageChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		setMessage(event.currentTarget.value);
	}

	const handleSend: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		meshService.send({
			type: "SEND_DATA",
			data: {
				message
			}
		});
	}

	return (
		<div>
			<ul>
				<li>Message</li>
			</ul>
			<form onSubmit={handleSend}>
				<input type="text" onChange={(e) => handleMessageChange(e)} value={message} />
				<button className='button'>Send</button>
			</form>
		</div>
	)
}

export default Chat;