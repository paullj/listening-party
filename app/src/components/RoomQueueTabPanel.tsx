import { Badge, Heading, Stack, TabPanel, Text } from "@chakra-ui/react";
import { useSelector } from "@xstate/react";
import { useQueueContext } from "../context/QueueContext";
import TrackItem from "./TrackItem";

interface RoomQueuePanelProps {
	// tracks: Track[]
}

const RoomQueueTabPanel = (props: RoomQueuePanelProps) => {
	const queueService = useQueueContext();
	const upNext = useSelector(
		queueService,
		(state) => state.context.queue?.[0] ?? null
	);
	const queue = useSelector(queueService, (state) => state.context.queue);

	return (
		<>
			<TabPanel max-h="full">
				<Heading fontSize={{ base: "md" }} mb={2}>
					<Text>Up Next:</Text>
				</Heading>
				{upNext ? <TrackItem {...upNext}></TrackItem> : "Nothing up next"}
				<Heading fontSize={{ base: "md" }} mt={4} mb={2}>
					<Text>In Queue:</Text>
				</Heading>
				{queue && queue.length >= 1 ? (
					<Stack overflowY="scroll" spacing={2}>
						{queue.slice(1).map(({ createdAt, ...track }) => (
							<TrackItem
								key={createdAt.toISOString()}
								createdAt={createdAt}
								{...track}
							></TrackItem>
						))}
					</Stack>
				) : (
					"Nothing in the queue"
				)}
			</TabPanel>
		</>
	);
};
export default RoomQueueTabPanel;
