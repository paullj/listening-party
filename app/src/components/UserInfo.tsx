import { Box } from "@chakra-ui/react";
import { useSelector } from "@xstate/react";
import { useRoomContext } from "../context/RoomContext";
import AvatarWithName from "./AvatarWithName";

const UserInfo = () => {
	const roomService = useRoomContext();
	const userId = useSelector(roomService, (state) => state.context.userId);

	const isConnected = useSelector(
		roomService,
		(state) => !state.matches("initial")
	);

	return (
		<>
			<Box position="absolute" top={4} left={4}>
				<AvatarWithName
					isConnected={isConnected}
					userId={userId}
					username={userId.slice(0, 6)}
				/>
			</Box>
		</>
	);
};

export default UserInfo;
