import { useContext, useEffect, useState } from "react";
import BoringAvatar from "boring-avatars";
import { useParams } from "react-router-dom";
import { useSelector } from "@xstate/react";
import { Tooltip, Spacer, Badge, Box, Heading, Stack, Text, Input, Button, Flex, IconButton, Tab, TabList, TabPanel, TabPanels, Tabs, Img, AspectRatio, FormControl } from "@chakra-ui/react";
import { ResetIcon, MagnifyingGlassIcon, TrackNextIcon, PaperPlaneIcon, PlayIcon, SpeakerModerateIcon } from '@radix-ui/react-icons';

import { MachineContext } from "../context/MachineProvider";

import type { ChangeEventHandler, MouseEventHandler } from "react";
import { Track } from "../models/RTCData";

const Room = () => {
	const { id } = useParams();
	const { stateService } = useContext(MachineContext)

	const { roomId, roomName, userId } = useSelector(stateService, (state) => state.context);
	const mesh = useSelector(stateService, (state) => [...state.context.mesh.values()]);
	const messages = useSelector(stateService, (state) => state.context.messages);
	const tracks = useSelector(stateService, (state) => state.context.tracks);
	const hasJoined = useSelector(stateService, (state) => state.matches("room"));

	const [message, setMessage] = useState("Hi!");

	const handleChangeMessage: ChangeEventHandler<HTMLInputElement> = async (event) => {
		setMessage(event?.currentTarget.value)
	}

	const handleSend: MouseEventHandler<HTMLButtonElement> = async (event) => {
		event.preventDefault();

		const track: Omit<Track, "id" | "votes"> = {
			userId,
			created: new Date(),
			title: "Track Name",
			album: "Album",
			artist: "Artist Name"
		}

		stateService.send({
			type: "SEND_DATA",
			data: track
		});
		stateService.send({
			type: "ADD_TRACK",
			...track
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
		<Flex h="100vh" direction={{ base: "column", md: "row" }}>
			<Box flexShrink={0} padding={2}>

				<Tooltip hasArrow placement="right" label='Leave party?'>
					<IconButton size="sm" _hover={{ bg: "red.100" }} _active={{ bg: "red.200" }} aria-label='Leave room' icon={<ResetIcon />} onClick={() => stateService.send("LEAVE_ROOM")} />
				</Tooltip>
				<Heading>
					<Text as="span" fontSize={{ base: '2xl', md: "3xl" }}>{roomName}</Text>
					<Badge ml={2} as="span" fontSize={{ base: 'lg', md: "xl" }} fontFamily="mono">{roomId}</Badge>
				</Heading>
				<Box>
					<Heading as="h3">
						<Text as="span" fontSize={{ base: 'lg' }}>Attendees</Text>
						<Badge rounded="full" ml={2} mt={1.5} px={2.5} py={0.5}>{mesh.length + 1}</Badge>
					</Heading>
					<Stack direction="column" spacing={2}>
						<Flex alignItems="center">
							<BoringAvatar size={30} name={userId} variant="beam"></BoringAvatar>
							<Text flexGrow={1} px={2} fontWeight="bold">Me</Text>
						</Flex>
						{mesh.map(({ userId, connection, channel }) => (
							<Flex key={userId} alignItems="center">
								<Box position="relative">
									<Badge position="absolute" bottom={0} right={0} borderWidth={2} borderColor="white" boxSize='1em' rounded="full" bg={channel.readyState === 'open' ? "green.500" : "red.500"} />
									<BoringAvatar size={30} name={userId.slice(0, 6)} variant="beam" />
								</Box>
								<Text flexGrow={1} px={2}>{userId.slice(0, 6)}</Text>
							</Flex>
						))}
					</Stack>
				</Box>
			</Box>
			<Flex flexGrow={1} p={2} direction={{ base: "column", lg: "row" }} alignItems="center">
				<Box w="full" mx="auto">
					<Flex direction="row" alignItems="center">
						<Box w="100px" h="100px">
							<AspectRatio flexShrink={0} maxW="100px" rounded="md" overflow="clip" ratio={1}>
								<Box w="full" h="full" bg="gray.300" />
							</AspectRatio>
						</Box>
						<Box>
							<Text>
								Title
							</Text>
							<Text>
								Artist
							</Text>
						</Box>
						<Box>
							<Text>
								Album
							</Text>
						</Box>
					</Flex>
					<Box>
						<Flex justifyContent="space-between">
							<Box>
								<IconButton variant="ghost" size="md" aria-label='Play track' icon={<PlayIcon />} />
								<IconButton variant="ghost" size="md" aria-label='Next track' icon={<TrackNextIcon />} />
							</Box>
							<Box>
							</Box>
							<IconButton variant="ghost" size="md" aria-label='Volume' icon={<SpeakerModerateIcon />} />
						</Flex>
					</Box>
				</Box>
				<Box w="full">
					<Tabs variant="soft-rounded" colorScheme="gray" flexGrow={1}>
						<TabPanels>
							<TabPanel>
								<Button w="full" variant="outline" leftIcon={<MagnifyingGlassIcon />}>
									<Text w="full" textAlign="left" fontWeight="normal">
										Search for a track
									</Text>
								</Button>
							</TabPanel>
							<TabPanel>
								<FormControl>
									<Flex>
										<Input placeholder="Write message here" />
										<IconButton onClick={handleSend} size="md" aria-label='Send' icon={<PaperPlaneIcon />} />
									</Flex>
								</FormControl>
							</TabPanel>
						</TabPanels>
						<TabList>
							<Tab rounded="lg">Queue</Tab>
							<Tab rounded="lg">Feed</Tab>
						</TabList>
						<TabPanels>
							<TabPanel>
								{tracks.map(({ userId, title, album, artist, created }) => (
									<Flex key={created.toISOString()}>
										<Box>
											<Box w="50px" h="50px">
												<AspectRatio flexShrink={0} maxW="100px" rounded="md" overflow="clip" ratio={1}>
													<Box w="full" h="full" bg="gray.300" />

												</AspectRatio>
											</Box>
										</Box>
										<Box>
											<Text>{title}</Text>
											<Text>{artist}</Text>
										</Box>
										<Text>{album}</Text>
										<Text>{userId}</Text>
									</Flex>
								))}
							</TabPanel>
							<TabPanel>
								<Stack flexGrow={1}>
									{messages.map(({ userId, content, created }) => (
										<Box key={created.toISOString()}>
											{content}
										</Box>
									))}
								</Stack>
							</TabPanel>
						</TabPanels>
					</Tabs>
				</Box>
			</Flex>
		</Flex>
	</>);
}

export default Room;