import { Text, Box, Tooltip, IconButton, Heading, Badge, Stack, Flex } from "@chakra-ui/react";
import Avatar from "boring-avatars";
import { ResetIcon } from "@radix-ui/react-icons";
import { useStateContext } from "../context/StateContext";

interface RoomSidebarProps {
	roomName: string,
	roomPin: string,
	me: string,
	peers: {
		userId: string,
		connected: boolean
	}[]
}

const RoomSidebar = (props: RoomSidebarProps) => {
	const stateService = useStateContext();
	const { roomName, roomPin, me, peers } = props;


	return (<>
		<Box w="full" h="full" padding={2}>
			<Tooltip hasArrow placement="right" label='Leave party?'>
				<IconButton size="sm" _hover={{ bg: "red.100" }} _active={{ bg: "red.200" }} aria-label='Leave room' icon={<ResetIcon />} onClick={() => stateService.send("LEAVE_ROOM")} />
			</Tooltip>
			<Heading>
				<Text as="span" fontSize={{ base: '2xl', md: "3xl" }}>{roomName}</Text>
				<Badge ml={2} as="span" fontSize={{ base: 'lg', md: "xl" }} fontFamily="mono">{roomPin}</Badge>
			</Heading>
			<Box>
				<Heading as="h3">
					<Text as="span" fontSize={{ base: 'lg' }}>Attendees</Text>
					<Badge rounded="full" ml={2} mt={1.5} px={2.5} py={0.5}>{peers.length + 1}</Badge>
				</Heading>
				<Stack direction="column" spacing={2}>
					<Flex alignItems="center">
						<Avatar size={30} name={me} variant="beam" />
						<Text flexGrow={1} px={2} fontWeight="bold">Me</Text>
					</Flex>
					{peers.map(({ userId, connected }) => (
						<Flex key={userId} alignItems="center">
							<Box position="relative">
								<Badge position="absolute" bottom={0} right={0} borderWidth={2} borderColor="white" boxSize='1em' rounded="full" bg={connected ? "green.500" : "red.500"} />
								<Avatar size={30} name={userId.slice(0, 6)} variant="beam" />
							</Box>
							<Text flexGrow={1} px={2}>{userId.slice(0, 6)}</Text>
						</Flex>
					))}
				</Stack>
			</Box>
		</Box>
	</>);
}
export default RoomSidebar;