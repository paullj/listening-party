import {
	Text,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Badge,
	Box,
} from "@chakra-ui/react";
import { useSelector } from "@xstate/react";
import { useEffect, useState } from "react";
import { useRoomContext } from "../context/RoomContext";

interface ErrorMeta {
	[key: string]: string;
}

interface ErrorMessage {
	path: string;
	message: string;
}

const consolidateErrors = (meta: ErrorMeta): ErrorMessage[] => {
	return Object.entries(meta).map(([path, meta]) => ({ path, message: meta }));
};

const ErrorMessage = () => {
	const roomService = useRoomContext();
	const failure = useSelector(roomService, (state) => state.matches("failure"));
	const meta = useSelector(roomService, (state) => state.meta);

	const [errors, setErrors] = useState<ErrorMessage[]>([]);

	useEffect(() => {
		setErrors(consolidateErrors(meta));
	}, [meta]);

	if (failure)
		return (
			<Alert status="error">
				<AlertIcon />
				<Box>
					<AlertTitle>Oh no!</AlertTitle>
					<AlertDescription>
						{errors.map(({ path, message }, i) => (
							<Box key={i}>
								<Text as="span">{message}</Text>
								<Badge variant="subtle" colorScheme="red">
									{path}
								</Badge>
							</Box>
						))}
					</AlertDescription>
				</Box>
			</Alert>
		);
	else return <></>;
};

export default ErrorMessage;
