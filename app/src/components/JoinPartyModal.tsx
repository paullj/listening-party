import { Icon, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, PinInput, PinInputField, HStack } from '@chakra-ui/react';
import { ClipboardIcon } from "@radix-ui/react-icons"
import { useSelector } from '@xstate/react';
import { useContext, useState } from 'react';
import { MachineContext } from '../context/MachineProvider';

interface JoinPartyModalProps {
	isOpen: boolean,
	onClose: () => void,
	onSubmit: (pin: string) => void
}

const JoinPartyModal = ({ isOpen, onClose, onSubmit }: JoinPartyModalProps) => {
	const { stateService } = useContext(MachineContext);
	const initialRoomId = useSelector(stateService, (state) => state.context.roomId);
	const [pin, setPin] = useState(initialRoomId);

	const handleChangePin = (pin: string) => {
		setPin(pin);
	}
	const handlePastePin = () => {
		navigator.clipboard.readText().then(clipText => {
			// TODO: also support pasting in share links
			setPin(clipText.slice(0, 6));
		})
	}

	return (<>
		<Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Enter party code</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<HStack>
						{/* <Button variant="ghost" onClick={() => handlePastePin()}>
							<Icon as={ClipboardIcon} />
						</Button> */}
						<PinInput type='alphanumeric' value={pin} onChange={handleChangePin}>
							<PinInputField textTransform="uppercase" />
							<PinInputField textTransform="uppercase" />
							<PinInputField textTransform="uppercase" />
							<PinInputField textTransform="uppercase" />
							<PinInputField textTransform="uppercase" />
							<PinInputField textTransform="uppercase" />
						</PinInput>
						<Button flexGrow={1} onClick={() => onSubmit(pin)}>Join</Button>
					</HStack>
				</ModalBody>

				<ModalFooter>
				</ModalFooter>
			</ModalContent>
		</Modal>
	</>);
}
export default JoinPartyModal;