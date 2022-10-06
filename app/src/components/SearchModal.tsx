import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	Input,
	InputLeftElement,
	InputGroup,
	Stack,
	Button,
} from "@chakra-ui/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useSelector } from "@xstate/react";
import { useFeedContext } from "../context/FeedContext";
import { useMeshContext } from "../context/MeshContext";
import { useQueueContext } from "../context/QueueContext";
import { useRoomContext } from "../context/RoomContext";
import { PeerAction } from "../models/actions";
import { Track } from "../models/RTCData";
import TrackItem from "./TrackItem";

interface SearchModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
	const roomService = useRoomContext();
	const userId = useSelector(roomService, (state) => state.context.userId);

	const searchResults = [
		{
			title: "Track 1",
			artist: "Alice",
			album: "Worst Hits 1",
		},
		{
			title: "Track 2",
			artist: "Bob",
			album: "Worst Hits 2",
		},
		{
			title: "Track 3",
			artist: "Charlie",
			album: "Worst Hits 3",
		},
	];

	const queueContext = useQueueContext();
	const meshContext = useMeshContext();
	const feedContext = useFeedContext();

	const handleAddToQueue = (track: Omit<Track, "createdAt" | "createdBy">) => {
		const addTrackToQueueAction: PeerAction = {
			type: "AddTrackToQueue",
			data: {
				...track,
				createdBy: userId,
				createdAt: new Date(),
			},
		};

		queueContext.send({
			type: "ADD_TO_QUEUE",
			newTrack: addTrackToQueueAction.data as Track,
		});
		feedContext.send({
			type: "ADD_ACTION",
			action: addTrackToQueueAction,
		});
		meshContext.send({
			type: "SEND_ACTION",
			action: addTrackToQueueAction,
		});
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalBody py={5}>
						<InputGroup variant="outline">
							<InputLeftElement
								color="gray.700"
								pointerEvents="none"
								children={<MagnifyingGlassIcon />}
							/>
							<Input placeholder="Search for a track" />
						</InputGroup>
						<hr />
						<Stack>
							{searchResults.map((track, i) => (
								<TrackItem key={i} {...track}>
									<Button size="sm" onClick={() => handleAddToQueue(track)}>
										Add
									</Button>
								</TrackItem>
							))}
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
export default SearchModal;
