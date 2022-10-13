import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "@xstate/react";
import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Spacer,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";

import { useRoomContext } from "../context/RoomContext";

import RoomSidebar from "../components/room/RoomSidebar";
import RoomQueueTabPanel from "../components/room/RoomQueueTabPanel";
import RoomFeedTabPanel from "../components/room/RoomFeedTabPanel";
import RoomHistoryTabPanel from "../components/room/RoomHistoryTabPanel";
import SearchButton from "../components/search/SearchButton";
import SearchModal from "../components/search/SearchModal";
import NowPlayingCard from "../components/player/NowPlayingCard";
import NowPlayingControls from "../components/player/NowPlayingControls";
import SendMessageInput from "../components/feed/SendMessageInput";
import { useFeedContext } from "../context/FeedContext";
import FeedTab from "../components/room/FeedTab";

const Room = () => {
  const { id } = useParams();
  const roomService = useRoomContext();
  const feedService = useFeedContext();

  const hasJoined = useSelector(roomService, (state) => state.matches("room"));
  const isHost = useSelector(
    roomService,
    (state) => state.context.userId === state.context.hostId
  );

  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleTabChange = (index: number) => {
    if (index === 2) {
      feedService.send("OPEN_FEED");
    } else {
      feedService.send("CLOSE_FEED");
    }
  };

  useEffect(() => {
    if (!hasJoined && id) {
      const listener = (state: any) => {
        if (state.matches("idle")) {
          roomService.send({ type: "JOIN_ROOM", roomId: id });
          roomService.off(listener);
        }
      };
      roomService.onTransition(listener);
    }
  }, [id, roomService]);

  return (
    <>
      <Flex h="100vh" direction={{ base: "column", md: "row" }}>
        <Box flexShrink={0} padding={2} minW="xs">
          <RoomSidebar />
        </Box>
        <Stack
          flexGrow={1}
          p={2}
          direction={{ base: "column", lg: "row" }}
          alignItems={{ base: "center", lg: "start" }}
        >
          <Box w="full" mx="auto">
            <NowPlayingCard></NowPlayingCard>
            <NowPlayingControls></NowPlayingControls>
          </Box>

          <Box flexGrow={1} w="full">
            <Tabs
              w="full"
              h="full"
              variant="soft-rounded"
              colorScheme="gray"
              onChange={handleTabChange}
            >
              <Flex direction="column" h="full">
                <TabPanels flexShrink={0}>
                  <TabPanel px={0}>
                    <SearchButton onClick={onOpen} />
                  </TabPanel>
                  <TabPanel px={0}>
                    <SearchButton onClick={onOpen} />
                  </TabPanel>
                  <TabPanel px={0}>
                    <SendMessageInput />
                  </TabPanel>
                </TabPanels>
                <TabList flexShrink={0}>
                  <Tab rounded="lg">Queue</Tab>
                  <Tab rounded="lg">History</Tab>
                  <Spacer />
                  <FeedTab />
                </TabList>
                <TabPanels flexGrow={1}>
                  <RoomQueueTabPanel />
                  <RoomHistoryTabPanel />
                  <RoomFeedTabPanel />
                </TabPanels>
              </Flex>
            </Tabs>
          </Box>
        </Stack>
        <SearchModal isOpen={isOpen} onClose={onClose} />
      </Flex>
    </>
  );
};

export default Room;
