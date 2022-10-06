import { Box, Flex, AspectRatio, Text, Spacer, Stack } from "@chakra-ui/react";
import { Track } from "../models/RTCData";

import type { PropsWithChildren } from "react";

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
			<Stack direction="row" alignItems="center">
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
				<Box w="25%">
					{title ?? <Text>{title}</Text>}
					<br />
					{artist ?? <Text>{artist}</Text>}
				</Box>
				<Box min-w="15%">{album ?? <Text>{album}</Text>}</Box>
				<Spacer></Spacer>
				<Box>{createdBy ?? <Text>{createdBy}</Text>}</Box>
				<Box>{children}</Box>
			</Stack>
		</>
	);
};
export default TrackItem;
