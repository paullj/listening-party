import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "@xstate/react";
import {
	Box,
	Flex,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Spacer,
	useDisclosure,
	Stack,
} from "@chakra-ui/react";

import { useRoomContext } from "../context/RoomContext";

import RoomSidebar from "../components/RoomSidebar";
import RoomQueueTabPanel from "../components/RoomQueueTabPanel";
import RoomFeedTabPanel from "../components/RoomFeedTabPanel";
import RoomHistoryTabPanel from "../components/RoomHistoryTabPanel";
import SearchButton from "../components/SearchButton";
import SearchModal from "../components/SearchModal";
import NowPlayingCard from "../components/NowPlayingCard";
import NowPlayingControls from "../components/NowPlayingControls";
import SendMessageInput from "../components/SendMessageInput";
import { FeedProvider } from "../context/FeedContext";
import { QueueProvider } from "../context/QueueContext";
import { MeshProvider, useMeshContext } from "../context/MeshContext";

const Room = () => {
	const { id } = useParams();
	const stateService = useRoomContext();
	const meshService = useMeshContext();

	const { roomId, roomName, userId } = useSelector(
		stateService,
		(state) => state.context
	);

	const hasJoined = useSelector(stateService, (state) => state.matches("room"));
	const { isOpen, onClose, onOpen } = useDisclosure();

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
			<QueueProvider>
				<FeedProvider>
					<MeshProvider>
						<Flex h="100vh" direction={{ base: "column", md: "row" }}>
							<Box flexShrink={0} padding={2}>
								<RoomSidebar />
							</Box>
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
									<Tabs
										w="full"
										h="full"
										variant="soft-rounded"
										colorScheme="gray"
									>
										<Flex direction="column" h="full">
											<TabPanels flexShrink={0}>
												<TabPanel px={0}>
													<SearchButton onClick={onOpen} />
												</TabPanel>
												<TabPanel px={0}>
													<SearchButton onClick={onOpen} />
												</TabPanel>
												<TabPanel px={0}>
													<SendMessageInput />
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
						</Flex>
					</MeshProvider>
				</FeedProvider>
			</QueueProvider>
		</>
	);
};

export default Room;
