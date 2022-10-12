import {
  Text,
  Box,
  Tooltip,
  IconButton,
  Heading,
  Badge,
  Stack,
  Flex,
  useColorMode,
  Spacer,
  Button,
} from "@chakra-ui/react";

import { ResetIcon, SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { useRoomContext } from "../../context/RoomContext";
import { useMeshContext } from "../../context/MeshContext";
import { useSelector } from "@xstate/react";
import AvatarWithName from "../shared/AvatarWithName";
import SyncButton from "./SyncButton";

interface RoomSidebarProps {}

const RoomSidebar = (props: RoomSidebarProps) => {
  const roomContext = useRoomContext();
  const meshContext = useMeshContext();
  const { toggleColorMode, colorMode } = useColorMode();

  const { roomName, roomId, userId, hostId } = useSelector(
    roomContext,
    (state) => state.context
  );

  const peers = useSelector(meshContext, (state) =>
    [...state.context.mesh.values()].map(({ userId, channel }) => ({
      userId,
      connected: channel.readyState === "open",
    }))
  );

  return (
    <>
      <Box w="full" h="full" padding={2}>
        {/* Toolbar buttons*/}
        <Stack direction="row" mb={{ base: 0, md: 4 }}>
          <Tooltip hasArrow placement="right" label="Leave party?">
            <IconButton
              size="sm"
              _hover={{ bg: "red.100" }}
              _active={{ bg: "red.200" }}
              aria-label="Leave room"
              icon={<ResetIcon />}
              onClick={() => roomContext.send("LEAVE_ROOM")}
            />
          </Tooltip>
          <Spacer></Spacer>
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Toggle mode"
            icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
          />
        </Stack>
        {/* Heading */}
        <Heading>
          <Text as="span" fontSize={{ base: "2xl", md: "3xl" }}>
            {roomName}
          </Text>
          <Badge
            ml={2}
            as="span"
            fontSize={{ base: "lg", md: "xl" }}
            fontFamily="mono"
          >
            {roomId}
          </Badge>
        </Heading>
        {/* Attendees */}
        <Box>
          <Heading as="h3" flex={1}>
            <Flex alignItems="center">
              <Text as="span" fontSize={{ base: "lg" }}>
                Attendees
              </Text>
              <Badge rounded="full" ml={2} mt={1.5} px={2.5} py={0.5}>
                {peers.length + 1}
              </Badge>
              <Spacer></Spacer>
              <SyncButton></SyncButton>
            </Flex>
          </Heading>
          <Stack direction="column" spacing={2}>
            <Flex alignItems="center" fontStyle="italic">
              <AvatarWithName
                userId={userId}
                username={`${userId.slice(0, 6)} ${
                  hostId === userId ? "(Host)" : ""
                }`}
              />
            </Flex>

            {peers.map(({ userId, connected }) => (
              <AvatarWithName
                key={userId}
                isConnected={connected}
                userId={userId}
                username={`${userId.slice(0, 6)} ${
                  hostId === userId ? "(Host)" : ""
                }`}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </>
  );
};
export default RoomSidebar;
