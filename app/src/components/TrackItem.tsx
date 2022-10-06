import { Box, AspectRatio, Text, Spacer, Stack } from "@chakra-ui/react";
import { Track } from "../models/RTCData";

import type { PropsWithChildren } from "react";
import Avatar from "boring-avatars";

interface TrackItemProps extends Partial<Track> {}

const TrackItem = ({
	children,
	title,
	artist,
	album,
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
							rounded="md"
							overflow="clip"
							ratio={1}
						>
							<Box w="full" h="full" bg="gray.300" />
						</AspectRatio>
					</Box>
				</Box>
				<Box min-w="25%">
					{title}
					<br />
					{artist}
				</Box>
				<Box textAlign="center" min-w="15%">
					{album}
				</Box>
				<Spacer></Spacer>
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
