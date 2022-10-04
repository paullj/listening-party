import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "@xstate/react";
import { Avatar, AvatarBadge, AvatarGroup, Badge, Box, Heading, Stack, Text, Input, Button, Flex, IconButton } from "@chakra-ui/react";
import { ResetIcon } from '@radix-ui/react-icons';

import { MachineContext } from "../context/MachineProvider";

import type { ChangeEventHandler, MouseEventHandler } from "react";

const Room = () => {
	const { id } = useParams();
	const { stateService } = useContext(MachineContext)

	const { roomId, roomName } = useSelector(stateService, (state) => state.context);
	const mesh = useSelector(stateService, (state) => [...state.context.mesh.values()]);
	const messages = useSelector(stateService, (state) => state.context.messages);
	const hasJoined = useSelector(stateService, (state) => state.matches("room"));

	const [message, setMessage] = useState("Hi!");

	const handleChangeMessage: ChangeEventHandler<HTMLInputElement> = async (event) => {
		setMessage(event?.currentTarget.value)
	}

	const handleSend: MouseEventHandler<HTMLButtonElement> = async (event) => {
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

	return (<>
		<Box h="100vh">
			<IconButton bg="red.300" _hover={{ bg: "red.400" }} _active={{ bg: "red.500" }} aria-label='Search database' icon={<ResetIcon />} onClick={() => stateService.send("LEAVE_ROOM")} />
			<Flex alignItems="center">
				<Heading>
					<Text as="span" fontSize={{ base: '2xl', md: "3xl" }}>{roomName}</Text>
					<Badge ml={2} as="span" fontSize={{ base: 'lg', md: "xl" }} fontFamily="mono">{roomId}</Badge>
				</Heading>
				<Box>
					<AvatarGroup size="sm" max={8}>
						<Avatar name="" >
						</Avatar>
						{mesh.map(({ userId, connection, channel }) => (
							<Avatar key={userId} name={userId.slice(0, 6)}>
								<AvatarBadge boxSize='1em' bg={channel.readyState === 'open' ? "green.500" : "red.500"} />
							</Avatar>
						))}
					</AvatarGroup>
				</Box>
			</Flex>
			<Box>
				<Stack>
					{messages.map(({ userId, content, created }) => (
						<Box key={created.toISOString()}>
							{content}
						</Box>
					))}
				</Stack>
				<Flex>
					<Input value={message} onChange={handleChangeMessage} placeholder='Basic usage' />
					<Button onClick={handleSend}>Send</Button>
				</Flex>
			</Box>
		</Box>
	</>);
}

export default Room;