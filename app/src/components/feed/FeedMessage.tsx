import { Stack, Box, Text, Spacer } from "@chakra-ui/react";
import { useSelector } from "@xstate/react";
import Avatar from "boring-avatars";
import { useRoomContext } from "../../context/RoomContext";
import { format } from "timeago.js";

import type { Message } from "../../models/message";
import type { PeerActionIdentifier } from "../../models/actions";

type FeedMessageProps = Message & Partial<PeerActionIdentifier>;

const FeedMessage = ({ createdBy, createdAt, content }: FeedMessageProps) => {
	const roomService = useRoomContext();
	const isMe = useSelector(
		roomService,
		(state) => state.context.userId === createdBy
	);

	return (
		<>
			<Stack
				direction={isMe ? "row-reverse" : "row"}
				textAlign={isMe ? "right" : "left"}
			>
				<Box flexShrink={0} mt={1}>
					<Avatar size={30} variant="beam" name={createdBy}></Avatar>
				</Box>
				<Box flexShrink={1}>
					<Box>
						<Text
							display="inline-block"
							bg="gray.100"
							rounded="lg"
							py={1}
							px={2}
						>
							{content}
						</Text>
					</Box>
					<Text fontSize="xs" mt={1}>
						{createdAt ? format(createdAt) : null}
					</Text>
				</Box>
				<Spacer></Spacer>
			</Stack>
		</>
	);
};
export default FeedMessage;
