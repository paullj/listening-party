import { Heading, TabPanel, Text } from "@chakra-ui/react";

interface RoomFeedTabPanelProps {

}

const RoomFeedTabPanel = (props: RoomFeedTabPanelProps) => {
	return (<>
		<TabPanel>
			{/* <Stack flexGrow={1}>
									{messages.map(({ createdBy, content, createdAt }) => (
										<Box key={createdAt.toISOString()}>
											{content}
										</Box>
									))}
								</Stack> */}
		</TabPanel>
	</>);
}
export default RoomFeedTabPanel;