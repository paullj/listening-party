import { Heading, Stack, TabPanel, Text } from "@chakra-ui/react";
import { useSelector } from "@xstate/react";
import { useQueueContext } from "../context/QueueContext";
import TrackItem from "./TrackItem";

interface RoomHistoryTabPanelProps {
	// tracks: Track[]
}

const RoomHistoryTabPanel = (props: RoomHistoryTabPanelProps) => {
	const queueService = useQueueContext();
	const history = useSelector(queueService, (state) => state.context.history);

	return (
		<>
			<TabPanel>
				{history && history.length >= 1 ? (
					<Stack spacing={2}>
						{history.map(({ createdAt, ...track }) => (
							<TrackItem
								key={createdAt.toISOString()}
								createdAt={createdAt}
								{...track}
							></TrackItem>
						))}
					</Stack>
				) : (
					"Nothing recently played"
				)}
			</TabPanel>
		</>
	);
};
export default RoomHistoryTabPanel;
