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
import { useQueueContext } from "../context/QueueContext";
import { Track } from "../models/RTCData";
import TrackItem from "./TrackItem";

interface SearchModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
	const searchResults = [
		{
			title: "Track 1",
			artist: "Alice",
			album: "Worst Hits 1",
			createdAt: new Date(2022, 1, 1),
			createdBy: "Me",
		},
		{
			title: "Track 2",
			artist: "Bob",
			album: "Worst Hits 2",
			createdAt: new Date(2022, 1, 2),
			createdBy: "You",
		},
		{
			title: "Track 3",
			artist: "Charlie",
			album: "Worst Hits 3",
			createdAt: new Date(2022, 1, 3),
			createdBy: "Me",
		},
	];

	const queueService = useQueueContext();

	const handleAddToQueue = (track: Omit<Track, "createdAt">) => {
		queueService.send({
			type: "ADD_TO_QUEUE",
			newTrack: { createdAt: new Date(), ...track },
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
							{searchResults.map(({ createdAt, ...track }) => (
								<TrackItem
									key={createdAt.toISOString()}
									createdAt={createdAt}
									{...track}
								>
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
