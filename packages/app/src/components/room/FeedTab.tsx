import { Badge, Tab } from "@chakra-ui/react";
import { useSelector } from "@xstate/react";
import { useFeedContext } from "../../context/FeedContext";

interface FeedTabProps {}

const FeedTab = (props: FeedTabProps) => {
	const feedService = useFeedContext();
	const unreadCount = useSelector(feedService, (state) => state.context.count);
	return (
		<>
			<Tab rounded="lg">
				{unreadCount ? (
					<Badge variant="solid" px={1.5} rounded="full" bg="blue.300" mr={2}>
						{unreadCount}
					</Badge>
				) : null}
				Feed
			</Tab>
		</>
	);
};
export default FeedTab;
