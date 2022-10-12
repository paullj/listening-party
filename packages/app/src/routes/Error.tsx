import { Container, IconButton } from "@chakra-ui/react";
import { ResetIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useSelector } from "@xstate/react";
import { useEffect } from "react";

import ErrorMessage from "../components/ErrorMessage";
import { useRoomContext } from "../context/RoomContext";

const Error = () => {
	const roomService = useRoomContext();
	const hasFailed = useSelector(roomService, (state) =>
		state.matches("failure")
	);

	useEffect(() => {
		if (!hasFailed) {
			roomService.send({ type: "RESET" });
		}
	}, [hasFailed, roomService]);

	return (
		<>
			<Container h="100vh">
				<IconButton
					bg="red.300"
					size="sm"
					_hover={{ bg: "red.400" }}
					_active={{ bg: "red.500" }}
					aria-label="Reset"
					icon={<ResetIcon />}
					onClick={() => roomService.send("RESET")}
				/>
				<IconButton
					ml={2}
					size="sm"
					aria-label="Retry"
					icon={<ReloadIcon />}
					onClick={() => roomService.send("RETRY")}
				/>
				<ErrorMessage />
			</Container>
		</>
	);
};
export default Error;
