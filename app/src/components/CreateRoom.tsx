import React, { ChangeEventHandler, FormEventHandler, useState } from 'react'
import type { MouseEventHandler } from 'react'
import {useNavigate} from "react-router-dom";

const CreateRoom = () => {
	const navigate = useNavigate();
	const [ roomID, setRoomID ] = useState("");

	const handleRoomIDChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		setRoomID(event?.currentTarget.value)
	}

	const handleCreateRoom: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()

		const resp = await fetch("http://localhost:8000/create")
		const { room_id } = await resp.json();

		navigate(`/room/${room_id}`, { state: { id: room_id}})
	}    
	const handleJoinRoom: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()
	
		navigate(`/room/${roomID}`, { state: { id: roomID}})
	}

  return (
		<>
			<form onSubmit={handleCreateRoom}>
				<button > Create Room</button>
			</form>

			<form onSubmit={handleJoinRoom}>
				<input type="text" value={roomID} onChange={(e) => handleRoomIDChange(e)} minLength={6} maxLength={6} required={true}/>
				<button> Join Room</button>
			</form>
		</>
  )
}

export default CreateRoom