import {
  Badge,
  Heading,
  IconButton,
  Stack,
  TabPanel,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useSelector } from "@xstate/react";
import { useQueueContext } from "../../context/QueueContext";
import TrackItem from "../shared/TrackItem";

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

  const bgHover = useColorModeValue("red.100", "red.400");
  const bgActive = useColorModeValue("red.200", "red.500");

  return (
    <>
      <TabPanel max-h="full">
        <Heading fontSize={{ base: "md" }} color="gray.700" mb={2}>
          <Text>Up Next:</Text>
        </Heading>
        {upNext ? (
          <TrackItem {...upNext}>
            <IconButton
              size="xs"
              _hover={{ bg: bgHover }}
              _active={{ bg: bgActive }}
              aria-label="Leave room"
              icon={<Cross1Icon />}
            />
          </TrackItem>
        ) : (
          "Nothing up next"
        )}
        <Heading fontSize={{ base: "md" }} color="gray.700" mt={4} mb={2}>
          <Text>In Queue:</Text>
        </Heading>
        {queue && queue.length >= 1 ? (
          <Stack overflowY="scroll" spacing={2}>
            {queue.slice(1).map(({ createdAt, ...track }, i) => (
              <TrackItem
                key={i}
                createdAt={createdAt}
                {...track}
                album={""}
                duration={0}
              >
                <IconButton
                  size="xs"
                  _hover={{ bg: bgHover }}
                  _active={{ bg: bgActive }}
                  aria-label="Leave room"
                  icon={<Cross1Icon />}
                />
              </TrackItem>
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
