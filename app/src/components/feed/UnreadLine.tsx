import { Box, Text } from "@chakra-ui/react";

interface UnreadLineProps {
	unreadCount: number;
}

const UnreadLine = ({ unreadCount }: UnreadLineProps) => {
	return (
		<>
			<Box pt={2} pb={4} px={10}>
				<Box as="hr"></Box>
				<Text
					textAlign="center"
					fontSize="sm"
					fontWeight="medium"
					color="gray.400"
				>
					{unreadCount} Update{unreadCount === 1 ? "" : "s"}
				</Text>
			</Box>
		</>
	);
};
export default UnreadLine;
