import { Box, Flex, IconButton, Spacer } from "@chakra-ui/react";
import {
  PlayIcon,
  TrackPreviousIcon,
  TrackNextIcon,
  SpeakerModerateIcon,
  PauseIcon,
} from "@radix-ui/react-icons";
import { useSelector } from "@xstate/react";
import { useQueueContext } from "../../context/QueueContext";
import { useBroadcastAction } from "../../hooks/useBroadcastAction";
import { getFormattedTime } from "../../utils/getFormattedTime";

interface NowPlayingControlsProps {}

const NowPlayingControls = (props: NowPlayingControlsProps) => {
  const queueService = useQueueContext();
  const hasNextTrack = useSelector(
    queueService,
    (state) => state.context.queue.length > 0
  );
  const hasCurrentTrack = useSelector(
    queueService,
    (state) => state.context.nowPlaying
  );
  const hasPrevTrack = useSelector(
    queueService,
    (state) => state.context.history.length > 0
  );
  const elapsedTime = useSelector(
    queueService,
    (state) => state.context.elapsed
  );
  const duration = useSelector(
    queueService,
    (state) => state.context.nowPlaying?.duration ?? 0
  );
  const isPlaying = useSelector(
    queueService,
    (state) => state.context.isPlaying
  );

  const previousTrackAction = useBroadcastAction("PreviousTrack");
  const nextTrackAction = useBroadcastAction("NextTrack");

  const handlePreviousTrack = () => {
    previousTrackAction({});
    queueService.send("PREV_TRACK");
  };

  const handlePlayTrack = () => {
    queueService.send("TOGGLE_PLAY");
  };

  const handleNextTrack = () => {
    nextTrackAction({});
    queueService.send("NEXT_TRACK");
  };

  return (
    <>
      <Box>
        <Flex justifyContent="space-between" alignItems="center">
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
              disabled={!hasCurrentTrack}
              onClick={() => handlePlayTrack()}
              icon={!isPlaying ? <PlayIcon /> : <PauseIcon />}
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
          <Spacer></Spacer>
          <Box fontFamily="mono" fontSize="xs">
            {getFormattedTime(elapsedTime)}/{getFormattedTime(duration)}
          </Box>
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
