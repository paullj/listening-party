import { useSelector } from "@xstate/react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";

import { useRoomContext } from "../context/RoomContext";
import JoinPartyModal from "../components/home/JoinPartyModal";
import UserInfo from "../components/home/UserInfo";

const Home = () => {
  const roomService = useRoomContext();
  const isIdle = useSelector(roomService, (state) => state.matches("idle"));
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Box>
      <UserInfo />

      <Flex minH="100vh" p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={6} w={"full"} maxW={"lg"}>
          <Box>
            <Text
              as="span"
              color="gray.400"
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight="bold"
              textTransform="uppercase"
            >
              In Development
            </Text>
            <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
              <Text as={"span"}>Listen to music</Text>
              <br />
              <Text
                as={"span"}
                position={"relative"}
                _after={{
                  content: "''",
                  width: "full",
                  height: useBreakpointValue({ base: "20%", md: "30%" }),
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                  bg: "purple.300",
                  zIndex: -1,
                }}
              >
                with your friends
              </Text>
              <br />
              <Text color={"purple.400"} as={"span"}>
                effortlessly.
              </Text>
            </Heading>
          </Box>
          <Text fontSize={{ base: "lg", lg: "xl" }} color={"gray.500"}>
            Host or join a party and add tracks from{" "}
            <Text as="span" color="black" fontWeight="semibold">
              Youtube
            </Text>
            ,{" "}
            <Text as="span" color="gray" fontWeight="semibold">
              Spotify*
            </Text>{" "}
            or{" "}
            <Text as="span" color="gray" fontWeight="semibold">
              Deezer*
            </Text>{" "}
            to a shared queue.
            <Text fontSize="sm" mt={2}>
              * Coming soon!
            </Text>
          </Text>
          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <Button
              onClick={() => roomService.send("CREATE_ROOM")}
              disabled={!isIdle}
              rounded="lg"
              bg="purple.300"
              _active={{ bg: "purple.500" }}
              _hover={{ bg: "purple.400" }}
            >
              Host a Party
            </Button>
            <Button disabled={!isIdle} onClick={onOpen} rounded="lg">
              Join a Party
            </Button>
            <JoinPartyModal
              isOpen={isOpen}
              onClose={onClose}
              onSubmit={(pin) =>
                roomService.send({ type: "JOIN_ROOM", roomId: pin })
              }
            />
          </Stack>
        </Stack>
      </Flex>
    </Box>
  );
};

export default Home;
