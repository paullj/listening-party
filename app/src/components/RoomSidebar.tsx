import {
	Text,
	Box,
	Tooltip,
	IconButton,
	Heading,
	Badge,
	Stack,
	Flex,
	useColorMode,
	Spacer,
	Button,
} from "@chakra-ui/react";

import { ResetIcon, SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { useRoomContext } from "../context/RoomContext";
import { useMeshContext } from "../context/MeshContext";
import { useSelector } from "@xstate/react";
import AvatarWithName from "./AvatarWithName";
import { useSendAction } from "../hooks/useSendAction";
import { useFeedContext } from "../context/FeedContext";
import { useBroadcastAction } from "../hooks/useBroadcastAction";

interface RoomSidebarProps {}

const RoomSidebar = (props: RoomSidebarProps) => {
	const roomService = useRoomContext();
	const feedContext = useFeedContext();
	const meshService = useMeshContext();
	const { toggleColorMode, colorMode } = useColorMode();

	const {
		roomName,
		roomId,
		userId,
		hostId: host,
	} = useSelector(roomService, (state) => state.context);

	const peers = useSelector(meshService, (state) =>
		[...state.context.mesh.values()].map(({ userId, channel }) => ({
			userId,
			connected: channel.readyState === "open",
		}))
	);

	const actions = useSelector(feedContext, (state) => state.context.feed);
	const requestSyncAction = useSendAction("RequestSync");
	const syncAction = useBroadcastAction("Sync");

	const handleRequestSync = () => {
		requestSyncAction(host, { userId });
	};

	const handleSync = () => {
		syncAction(actions);
	};

	return (
		<>
			<Box w="full" h="full" padding={2}>
				{/* Toolbar buttons*/}
				<Stack direction="row" mb={{ base: 0, md: 4 }}>
					<Tooltip hasArrow placement="right" label="Leave party?">
						<IconButton
							size="sm"
							_hover={{ bg: "red.100" }}
							_active={{ bg: "red.200" }}
							aria-label="Leave room"
							icon={<ResetIcon />}
							onClick={() => roomService.send("LEAVE_ROOM")}
						/>
					</Tooltip>
					<Spacer></Spacer>
					<IconButton
						size="sm"
						variant="ghost"
						aria-label="Toggle mode"
						icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
						onClick={toggleColorMode}
					/>
				</Stack>
				{/* Heading */}
				<Heading>
					<Text as="span" fontSize={{ base: "2xl", md: "3xl" }}>
						{roomName}
					</Text>
					<Badge
						ml={2}
						as="span"
						fontSize={{ base: "lg", md: "xl" }}
						fontFamily="mono"
					>
						{roomId}
					</Badge>
				</Heading>
				{/* Attendees */}
				<Box>
					<Heading as="h3">
						<Text as="span" fontSize={{ base: "lg" }}>
							Attendees
						</Text>
						<Badge rounded="full" ml={2} mt={1.5} px={2.5} py={0.5}>
							{peers.length + 1}
						</Badge>
					</Heading>
					<Stack direction="column" spacing={2}>
						<Flex alignItems="center" fontStyle="italic">
							<AvatarWithName
								userId={userId}
								username={`${userId.slice(0, 6)} ${
									host === userId ? "(Host)" : ""
								}`}
							/>
						</Flex>

						{peers.map(({ userId, connected }) => (
							<AvatarWithName
								key={userId}
								isConnected={connected}
								userId={userId}
								username={`${userId.slice(0, 6)} ${
									host === userId ? "(Host)" : ""
								}`}
							/>
						))}
					</Stack>
				</Box>

				<Box>
					{host === userId ? (
						<Button onClick={() => handleSync()}>Sync</Button>
					) : (
						<Button onClick={() => handleRequestSync()}>Request Sync</Button>
					)}
				</Box>
			</Box>
		</>
	);
};
export default RoomSidebar;
