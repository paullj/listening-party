import { Text, Stack, TabPanel } from "@chakra-ui/react";
import { useSelector } from "@xstate/react";
import { useFeedContext } from "../context/FeedContext";
import FeedMessage from "./FeedMessage";
import { Fragment } from "react";
import UnreadLine from "./UnreadLine";
import type { PeerActionData, PeerActionType } from "../models/actions";

interface RoomFeedTabPanelProps {}

const RoomFeedTabPanel = (props: RoomFeedTabPanelProps) => {
	const feedService = useFeedContext();
	const feed = useSelector(feedService, (state) => state.context.feed);
	const unreadCount = useSelector(feedService, (state) => state.context.count);
	const unreadOffset = useSelector(
		feedService,
		(state) => state.context.offset
	);

	return (
		<>
			<TabPanel>
				{feed && feed.length >= 1 ? (
					<Stack overflowY="scroll" spacing={2}>
						{feed.map(({ type, data }, i) => (
							<Fragment key={i}>
								{getFeedItem(type, data)}
								{i === unreadOffset + unreadCount - 1 ? (
									<UnreadLine unreadCount={unreadCount} />
								) : null}
							</Fragment>
						))}
					</Stack>
				) : (
					"Feed Empty"
				)}
			</TabPanel>
		</>
	);
};

const getFeedItem = <T extends PeerActionType>(
	type: T,
	data: PeerActionData<T>
) => {
	switch (type) {
		case "AddMessage":
			return <FeedMessage {...(data as PeerActionData<"AddMessage">)} />;
		default:
			return (
				<Text
					fontWeight="medium"
					fontSize="xs"
					textAlign="center"
					color="red.200"
				>{`${type} by ${data?.createdBy.slice(0, 6)}`}</Text>
			);
	}
};

export default RoomFeedTabPanel;
