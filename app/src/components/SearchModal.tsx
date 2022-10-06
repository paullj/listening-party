import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	Input,
	InputLeftElement,
	InputGroup,
	Stack,
	Box,
	Button,
} from "@chakra-ui/react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useSelector } from "@xstate/react";
import { useQueueContext } from "../context/QueueContext";
import { useRoomContext } from "../context/RoomContext";
import { usePeerAction } from "../hooks/useAction";
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
			title: "Example Track 1",
			artist: "Alice",
			album: "Album 1",
		},
		{
			title: "Example Track 2",
			artist: "Bob",
			album: "Album 2",
		},
		{
			title: "Example Track 3",
			artist: "Charlie",
			album: "Album 3",
		},
	];

	const queueContext = useQueueContext();
	const addTrackToQueueAction = usePeerAction("AddTrackToQueue");

	const handleAddToQueue = (track: Omit<Track, "createdAt" | "createdBy">) => {
		const newTrack: Track = {
			...track,
			createdBy: userId,
			createdAt: new Date(),
		};

		queueContext.send({
			type: "ADD_TO_QUEUE",
			newTrack,
		});
		addTrackToQueueAction(newTrack);
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} size="2xl">
				<ModalOverlay />
				<ModalContent>
					<ModalBody py={5}>
						<InputGroup variant="flushed" mb={4}>
							<InputLeftElement
								color="gray.700"
								pointerEvents="none"
								children={<MagnifyingGlassIcon />}
							/>
							<Input placeholder="Search for a track" />
						</InputGroup>
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
