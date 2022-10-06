import { Box, Flex, IconButton } from "@chakra-ui/react";
import {
	PlayIcon,
	TrackPreviousIcon,
	TrackNextIcon,
	SpeakerModerateIcon,
} from "@radix-ui/react-icons";
import { useSelector } from "@xstate/react";
import { useQueueContext } from "../context/QueueContext";
import { usePeerAction } from "../hooks/useAction";

interface NowPlayingControlsProps {}

const NowPlayingControls = (props: NowPlayingControlsProps) => {
	const queueService = useQueueContext();
	const hasNextTrack = useSelector(
		queueService,
		(state) => state.context.queue.length > 0
	);
	const hasPrevTrack = useSelector(
		queueService,
		(state) => state.context.history.length > 0
	);
	const previousTrackAction = usePeerAction("PreviousTrack");
	const nextTrackAction = usePeerAction("NextTrack");

	const handlePreviousTrack = () => {
		previousTrackAction();
		queueService.send("PREV_TRACK");
	};

	const handlePlayTrack = () => {};

	const handleNextTrack = () => {
		nextTrackAction();
		queueService.send("NEXT_TRACK");
	};

	return (
		<>
			<Box>
				<Flex justifyContent="space-between">
					<Box>
						<IconButton
							variant="ghost"
							size="md"
							aria-label="Previous track"
							disabled={!hasPrevTrack}
							onClick={() => handlePreviousTrack()}
							icon={<TrackPreviousIcon />}
						/>
						<IconButton
							variant="ghost"
							size="md"
							aria-label="Play track"
							disabled
							onClick={() => handlePlayTrack()}
							icon={<PlayIcon />}
						/>
						<IconButton
							variant="ghost"
							size="md"
							aria-label="Next track"
							disabled={!hasNextTrack}
							onClick={() => handleNextTrack()}
							icon={<TrackNextIcon />}
						/>
					</Box>
					<Box></Box>
					<IconButton
						variant="ghost"
						size="md"
						disabled
						aria-label="Volume"
						icon={<SpeakerModerateIcon />}
					/>
				</Flex>
			</Box>
		</>
	);
};
export default NowPlayingControls;
