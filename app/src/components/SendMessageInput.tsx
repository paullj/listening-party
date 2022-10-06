import { useState } from "react";
import { FormControl, Input, IconButton, Stack } from "@chakra-ui/react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useSelector } from "@xstate/react";

import { useFeedContext } from "../context/FeedContext";
import { useRoomContext } from "../context/RoomContext";

import type { Message } from "../models/RTCData";
import type { ChangeEventHandler, MouseEventHandler } from "react";
import { useMeshContext } from "../context/MeshContext";

interface SendMessageInputProps {}

const SendMessageInput = (props: SendMessageInputProps) => {
	const roomService = useRoomContext();
	const meshService = useMeshContext();
	const feedService = useFeedContext();

	const userId = useSelector(roomService, (state) => state.context.userId);

	const [messageContent, setMessageContent] = useState("");

	const handleChangeMessage: ChangeEventHandler<HTMLInputElement> = async (
		event
	) => {
		setMessageContent(event?.currentTarget.value);
	};

	const handleSend: MouseEventHandler<HTMLButtonElement> = async (event) => {
		event.preventDefault();

		const message: Message = {
			createdBy: userId,
			createdAt: new Date(),
			content: messageContent,
		};
		feedService.send({ type: "ADD_MESSAGE", message });
		meshService.send({ type: "SEND_MESSAGE", message });
		setMessageContent("");
	};
	return (
		<>
			<FormControl>
				<Stack direction="row">
					<Input
						placeholder="Write message here"
						value={messageContent}
						onChange={handleChangeMessage}
					/>
					<IconButton
						variant="ghost"
						onClick={handleSend}
						aria-label="Send"
						icon={<PaperPlaneIcon />}
					/>
				</Stack>
			</FormControl>
		</>
	);
};
export default SendMessageInput;
