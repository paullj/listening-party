import { Text, Box, Flex, AspectRatio } from "@chakra-ui/react";
import { useSelector } from "@xstate/react";
import { useQueueContext } from "../../context/QueueContext";
import TrackItem from "../shared/TrackItem";

interface NowPlayingCardProps {}

const NowPlayingCard = (props: NowPlayingCardProps) => {
	const queueService = useQueueContext();
	const nowPlaying = useSelector(
		queueService,
		(state) => state.context.nowPlaying
	);

	// TODO: replace this with an actual now playing card
	return (
		<>
			{nowPlaying ? <TrackItem {...nowPlaying}></TrackItem> : null}
			{/* <Flex direction="row" alignItems="center">
				<Box w="100px" h="100px">
					<AspectRatio
						flexShrink={0}
						maxW="100px"
						rounded="md"
						overflow="clip"
						ratio={1}
					>
						<Box w="full" h="full" bg="gray.300" />
					</AspectRatio>
				</Box>
				<Box>
					<Text>{nowPlaying?.title}</Text>
					<Text>{nowPlaying?.artist}</Text>
				</Box>
				<Box>
					<Text>{nowPlaying?.album}</Text>
				</Box>
			</Flex> */}
		</>
	);
};
export default NowPlayingCard;
