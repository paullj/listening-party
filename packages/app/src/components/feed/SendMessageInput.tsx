import { useState } from "react";
import { FormControl, Input, IconButton, Stack } from "@chakra-ui/react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import type { ChangeEventHandler, MouseEventHandler } from "react";
import { useBroadcastAction } from "../../hooks/useBroadcastAction";

interface SendMessageInputProps {}

const SendMessageInput = (props: SendMessageInputProps) => {
	const addMessageAction = useBroadcastAction("AddMessage");
	const [messageContent, setMessageContent] = useState("");

	const handleChangeMessage: ChangeEventHandler<HTMLInputElement> = async (
		event
	) => {
		setMessageContent(event?.currentTarget.value);
	};

	const handleSend: MouseEventHandler<HTMLButtonElement> = async (event) => {
		event.preventDefault();

		addMessageAction({ content: messageContent });
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
