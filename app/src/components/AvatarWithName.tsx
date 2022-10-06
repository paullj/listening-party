import { Text, Badge, Box, Flex, Stack, Tooltip } from "@chakra-ui/react";
import Avatar from "boring-avatars";

interface AvatarWithNameProps {
	userId: string;
	username: string;
	isConnected?: boolean;
}

const AvatarWithName = ({
	userId,
	username,
	isConnected,
}: AvatarWithNameProps) => {
	return (
		<>
			<Stack direction="row" alignItems="center">
				<Flex alignItems="center">
					<Tooltip
						hasArrow
						closeOnClick={false}
						isDisabled={isConnected === undefined}
						placement="auto"
						label={isConnected ? "Connected" : "Disconnected"}
					>
						<Box position="relative">
							{isConnected === undefined || (
								<Badge
									position="absolute"
									bottom={0}
									right={0}
									borderWidth={2}
									borderColor="white"
									boxSize="1em"
									rounded="full"
									bg={isConnected ? "green.500" : "red.500"}
								/>
							)}
							<Avatar size={30} name={userId} variant="beam" />
						</Box>
					</Tooltip>
					<Text flexGrow={1} px={2} fontFamily="mono">
						{username}
					</Text>
				</Flex>
			</Stack>
		</>
	);
};
export default AvatarWithName;
