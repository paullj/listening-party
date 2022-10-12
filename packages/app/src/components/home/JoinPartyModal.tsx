import { useState } from "react";
import { useSelector } from "@xstate/react";
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	FormControl,
	FormLabel,
	FormHelperText,
	ModalCloseButton,
	ModalBody,
	PinInput,
	PinInputField,
	HStack,
	ModalHeader,
} from "@chakra-ui/react";
import { useRoomContext } from "../../context/RoomContext";

interface JoinPartyModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (pin: string) => void;
}

const JoinPartyModal = ({ isOpen, onClose, onSubmit }: JoinPartyModalProps) => {
	const roomService = useRoomContext();
	const initialRoomId = useSelector(
		roomService,
		(state) => state.context.roomId
	);
	const [pin, setPin] = useState(initialRoomId);

	const handleChangePin = (pin: string) => {
		setPin(pin);
	};
	const handlePastePin = () => {
		navigator.clipboard.readText().then((clipText) => {
			// TODO: also support pasting in share links
			setPin(clipText.slice(0, 6));
		});
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				isCentered
				closeOnOverlayClick={false}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalBody mt={2} mb={4}>
						<ModalCloseButton zIndex={10} />
						<FormControl>
							<FormLabel>Party code:</FormLabel>
							<HStack>
								<PinInput
									type="alphanumeric"
									value={pin}
									onChange={handleChangePin}
								>
									<PinInputField textTransform="uppercase" />
									<PinInputField textTransform="uppercase" />
									<PinInputField textTransform="uppercase" />
									<PinInputField textTransform="uppercase" />
									<PinInputField textTransform="uppercase" />
									<PinInputField textTransform="uppercase" />
								</PinInput>
								<Button flexGrow={1} onClick={() => onSubmit(pin)}>
									Enter
								</Button>
							</HStack>
							<FormHelperText>
								Enter the 6 letter/digit code for the party
							</FormHelperText>
						</FormControl>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
export default JoinPartyModal;
