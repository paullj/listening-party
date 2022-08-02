import React, { useEffect, useRef, useState, ChangeEventHandler, FormEventHandler} from 'react';
import { useParams } from "react-router-dom";

import { useMessagesStore } from '../stores/messages';
import { useUserState } from '../stores/user';

import { Client } from "ion-sdk-js";
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl";

const signal = new IonSFUJSONRPCSignal("ws://localhost:9000/ws");

const client = new Client(signal, {
	codec: "vp8",
	iceServers: [
		// https://www.metered.ca/tools/openrelay/
		{
			urls: "stun:openrelay.metered.ca:80",
		},
		{
			urls: "turn:openrelay.metered.ca:80",
			username: "openrelayproject",
			credential: "openrelayproject",
		},
		// {
		// 	urls: "turn:openrelay.metered.ca:443",
		// 	username: "openrelayproject",
		// 	credential: "openrelayproject",
		// },
		// {
		// 	urls: "turn:openrelay.metered.ca:443?transport=tcp",
		// 	username: "openrelayproject",
		// 	credential: "openrelayproject",
		// },
	],
});

const App = () => {
	const params = useParams();
	const [roomID] = useState(params.id ?? 'ABC123')
	const { messages, receiveMessage, createMessage } = useMessagesStore();
	const { userID } = useUserState();
	const [newMessageContent, setNewMessageContent] = useState("");
	const dataChannelRef = useRef<RTCDataChannel>()

  useEffect(() => {
    signal.onopen = () => {
			console.log(`${userID} is joining ${roomID}`)
			
			client.join(roomID, userID);
			
			client.ondatachannel = handleDataChannelEvent;

			setTimeout(() => {
				if(!dataChannelRef.current) {
					dataChannelRef.current = client.createDataChannel('chat')
				}
			}, 1000);
			// dataChannelRef.current = client.createDataChannel('chat')
			// dataChannelRef.current.onmessage = handleDataEvent
		};
		// signal.onerror = (e) => console.error(e)
		
		return () => {
			console.log("Closing connection")
			client.close();
		}
  }, []);

	const handleDataChannelEvent = (e: RTCDataChannelEvent) => {
			dataChannelRef.current = e.channel
			dataChannelRef.current.onmessage = handleDataEvent
			console.log("Found channel: ", e.channel.label);
	};

	const handleDataEvent = (e: MessageEvent<any>) => {
			// console.log("Received Data: ", e.data);
			receiveMessage(JSON.parse(e.data))
	};

	const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();
		const newMessage = createMessage(newMessageContent)
		dataChannelRef.current?.send(JSON.stringify(newMessage))
		setNewMessageContent('')
	}

	const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		setNewMessageContent(event.currentTarget.value);
	}

  return (
		<div>
			<h1>{roomID}</h1>
			<h2>{userID.slice(0, 6)}</h2>
			<ul>
				{messages.map(({content, from}, i) => <li key={i} style={{color: from === userID ? 'blue' : 'black'}}>{content} - {from.slice(0, 6)}</li>)
				}
			</ul>
			<form onSubmit={(e) => handleSubmit(e)}>
				<input value={newMessageContent} onChange={(e) => handleInputChange(e)} placeholder="Type a message"></input>
				<button>Send</button>
			</form>
		</div>
  );
}

export default App;