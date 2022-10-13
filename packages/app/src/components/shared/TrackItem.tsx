import { Box, AspectRatio, Text, Spacer, Stack, Image } from "@chakra-ui/react";
import { Track } from "../../models/track";

import type { PropsWithChildren } from "react";
import Avatar from "boring-avatars";
import { PeerActionIdentifier, WithIdentifier } from "../../models/actions";
import { getFormattedTime } from "../../utils/getFormattedTime";

type TrackItemProps = WithIdentifier<Omit<Track, "uri">>;

const TrackItem = ({
  children,
  title,
  artist,
  album,
  coverUri,
  duration,
  createdBy,
}: PropsWithChildren<TrackItemProps>) => {
  return (
    <>
      <Stack direction="row" alignItems="center" spacing={4} fontSize="sm">
        <Box>
          <Box w="50px" h="50px">
            <AspectRatio
              flexShrink={0}
              maxW="100px"
              rounded="sm"
              overflow="clip"
              ratio={1}
            >
              {coverUri ? (
                <Image src={coverUri} />
              ) : (
                <Box w="full" h="full" bg="gray.300" />
              )}
            </AspectRatio>
          </Box>
        </Box>
        <Box flexShrink={0}>
          <Text fontWeight="medium">{title}</Text>
          <Text>{artist}</Text>
        </Box>
        <Spacer></Spacer>

        <Box textAlign="right">{album}</Box>
        <Box>{duration ? getFormattedTime(duration) : null}</Box>
        <Box>
          {createdBy ? (
            <Avatar size={20} variant="beam" name={createdBy}></Avatar>
          ) : null}
        </Box>

        <Stack direction="row" spacing={1}>
          {children}
        </Stack>
      </Stack>
    </>
  );
};
export default TrackItem;
