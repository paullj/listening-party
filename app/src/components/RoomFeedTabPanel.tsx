import { Stack, TabPanel } from "@chakra-ui/react";
import { useSelector } from "@xstate/react";
import { useFeedContext } from "../context/FeedContext";
import { Message } from "../models/RTCData";
import FeedMessage from "./FeedMessage";
import { useEffect } from "react";
import UnreadLine from "./UnreadLine";

interface RoomFeedTabPanelProps {}

const RoomFeedTabPanel = (props: RoomFeedTabPanelProps) => {
	const feedService = useFeedContext();
	const feed = useSelector(feedService, (state) => state.context.feed);
	const unreadCount = useSelector(feedService, (state) => state.context.unread);

	return (
		<>
			<TabPanel>
				{feed && feed.length >= 1 ? (
					<Stack overflowY="scroll" spacing={2}>
						{feed.map(({ kind, ...item }, i) => {
							switch (kind) {
								case "Message":
									return (
										<>
											<FeedMessage key={i} {...(item as Message)}></FeedMessage>
											{i === unreadCount - 1 ? (
												<UnreadLine unreadCount={unreadCount} />
											) : null}
										</>
									);
							}
						})}
					</Stack>
				) : (
					"Feed Empty"
				)}
			</TabPanel>
		</>
	);
};

export default RoomFeedTabPanel;
