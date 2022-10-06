import { Box } from "@chakra-ui/react";
import { useSelector } from "@xstate/react";
import { useRoomContext } from "../context/RoomContext";
import AvatarWithName from "./AvatarWithName";

const UserInfo = () => {
	const roomService = useRoomContext();
	const userId = useSelector(roomService, (state) => state.context.userId);
	const states = useSelector(roomService, (state) => state.toStrings());

	const isConnected = useSelector(
		roomService,
		(state) => !state.matches("initial")
	);

	return (
		<>
			<Box position="absolute" top={2} left={2}>
				<AvatarWithName
					isConnected={isConnected}
					userId={userId}
					username={userId.slice(0, 6)}
				/>
				{/* {states.map((state, i) => (
					<Badge key={i} px={1.5} rounded="md" variant="outline">
						{state}
					</Badge>
				))} */}
			</Box>
		</>
	);
};

export default UserInfo;
