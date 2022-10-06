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
import { FeedProvider, useFeedContext } from "../context/FeedContext";
import { QueueProvider } from "../context/QueueContext";
import { MeshProvider } from "../context/MeshContext";
import FeedTab from "../components/FeedTab";

const Room = () => {
	const { id } = useParams();
	const roomService = useRoomContext();
	const feedService = useFeedContext();

	const hasJoined = useSelector(roomService, (state) => state.matches("room"));
	const { isOpen, onClose, onOpen } = useDisclosure();

	const handleTabChange = (index: number) => {
		if (index === 2) {
			feedService.send("OPEN_FEED");
		} else {
			feedService.send("CLOSE_FEED");
		}
	};

	useEffect(() => {
		if (!hasJoined && id) {
			const listener = (state: any) => {
				if (state.matches("idle")) {
					roomService.send({ type: "JOIN_ROOM", roomId: id });
					roomService.off(listener);
				}
			};
			roomService.onTransition(listener);
		}
	}, [id, roomService]);

	return (
		<>
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
							onChange={handleTabChange}
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
									<FeedTab />
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
		</>
	);
};

export default Room;
