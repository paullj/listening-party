import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "@xstate/react";
import {
	Box,
	Input,
	Flex,
	IconButton,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	FormControl,
	Spacer,
	useDisclosure,
	Stack,
} from "@chakra-ui/react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

import { useStateContext } from "../context/StateContext";

import type { ChangeEventHandler, MouseEventHandler } from "react";
import { Track } from "../models/RTCData";
import RoomSidebar from "../components/RoomSidebar";
import RoomQueueTabPanel from "../components/RoomQueueTabPanel";
import RoomFeedTabPanel from "../components/RoomFeedTabPanel";
import RoomHistoryTabPanel from "../components/RoomHistoryTabPanel";
import SearchButton from "../components/SearchButton";
import SearchModal from "../components/SearchModal";
import { QueueProvider } from "../context/QueueContext";
import NowPlayingCard from "../components/NowPlayingCard";
import NowPlayingControls from "../components/NowPlayingControls";

const Room = () => {
	const { id } = useParams();
	const stateService = useStateContext();

	const { roomId, roomName, userId } = useSelector(
		stateService,
		(state) => state.context
	);
	const peers = useSelector(stateService, (state) =>
		[...state.context.mesh.values()].map(({ userId, channel }) => ({
			userId,
			connected: channel.readyState === "open",
		}))
	);
	const hasJoined = useSelector(stateService, (state) => state.matches("room"));
	const { isOpen, onClose, onOpen } = useDisclosure();

	const [message, setMessage] = useState("Hi!");

	const handleChangeMessage: ChangeEventHandler<HTMLInputElement> = async (
		event
	) => {
		setMessage(event?.currentTarget.value);
	};

	const handleSend: MouseEventHandler<HTMLButtonElement> = async (event) => {
		event.preventDefault();

		const track: Omit<Track, "id" | "votes"> = {
			createdBy: userId,
			createdAt: new Date(),
			title: "Track Name",
			album: "Album",
			artist: "Artist Name",
		};

		stateService.send({
			type: "SEND_DATA",
			data: track,
		});
		// stateService.send({
		// 	type: "ADD_TRACK",
		// 	...track
		// });
		setMessage("");
	};

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

	return (
		<>
			<Flex h="100vh" direction={{ base: "column", md: "row" }}>
				<Box flexShrink={0} padding={2}>
					<RoomSidebar
						roomName={roomName}
						roomPin={roomId}
						me={userId}
						peers={peers}
					/>
				</Box>
				<QueueProvider>
					<Stack
						flexGrow={1}
						p={2}
						direction={{ base: "column", lg: "row" }}
						alignItems="center"
					>
						<Box w="full" mx="auto">
							<NowPlayingCard></NowPlayingCard>
							<NowPlayingControls></NowPlayingControls>
						</Box>

						<Box flexGrow={1} w="full">
							<Tabs w="full" h="full" variant="soft-rounded" colorScheme="gray">
								<Flex direction="column" h="full">
									<TabPanels flexShrink={0}>
										<TabPanel>
											<SearchButton onClick={onOpen} />
										</TabPanel>
										<TabPanel>
											<SearchButton onClick={onOpen} />
										</TabPanel>
										<TabPanel>
											<FormControl>
												<Flex>
													<Input placeholder="Write message here" />
													<IconButton
														variant="ghost"
														onClick={handleSend}
														size="md"
														aria-label="Send"
														icon={<PaperPlaneIcon />}
													/>
												</Flex>
											</FormControl>
										</TabPanel>
									</TabPanels>
									<TabList flexShrink={0}>
										<Tab rounded="lg">Queue</Tab>
										<Tab rounded="lg">History</Tab>
										<Spacer />
										<Tab rounded="lg">Feed</Tab>
									</TabList>
									<TabPanels flexGrow={1}>
										<RoomQueueTabPanel />
										<RoomHistoryTabPanel />
										<RoomFeedTabPanel />
									</TabPanels>
								</Flex>
							</Tabs>
						</Box>
					</Stack>
					<SearchModal isOpen={isOpen} onClose={onClose} />
				</QueueProvider>
			</Flex>
		</>
	);
};

export default Room;
