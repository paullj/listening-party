import { Box, Heading, Stack, TabPanel, Text } from "@chakra-ui/react";
import { useSelector } from "@xstate/react";
import { useFeedContext } from "../context/FeedContext";
import { useQueueContext } from "../context/QueueContext";
import SendMessageInput from "./SendMessageInput";

interface RoomFeedTabPanelProps {}

const RoomFeedTabPanel = (props: RoomFeedTabPanelProps) => {
	const feedService = useFeedContext();
	const feed = useSelector(feedService, (state) => state.context.feed);

	return (
		<>
			<TabPanel>
				{feed && feed.length >= 1 ? (
					<Stack overflowY="scroll" spacing={2}>
						{feed.map(({ createdAt, ...item }) => (
							<Box key={createdAt.toISOString()}>{JSON.stringify(item)}</Box>
						))}
					</Stack>
				) : (
					"Feed Empty"
				)}
			</TabPanel>
		</>
	);
};
export default RoomFeedTabPanel;
