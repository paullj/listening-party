import { useContext } from 'react';
import { MachineContext } from '../context/MachineProvider';

import {
	Box,
	Button,
	Flex,
	Heading,
	Stack,
	Text,
	useBreakpointValue,
	useDisclosure,
} from '@chakra-ui/react';

import { useSelector } from '@xstate/react';
import JoinPartyModal from '../components/JoinPartyModal';

const Home = () => {
	const { stateService } = useContext(MachineContext);
	const isIdle = useSelector(stateService, (state) => state.matches("idle"));
	const { isOpen, onClose, onOpen } = useDisclosure();

	return (
		<Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
			<Flex p={8} flex={1} align={'center'} justify={'center'}>
				<Stack spacing={6} w={'full'} maxW={'lg'}>
					<Box>
						<Text as="span" color="gray.400" fontSize={{ base: 'xs', md: 'sm' }} fontWeight="bold" textTransform="uppercase">In Development</Text>
						<Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
							<Text as={'span'}>
								Listen to music
							</Text>
							<br />
							<Text
								as={'span'}
								position={'relative'}
								_after={{
									content: "''",
									width: 'full',
									height: useBreakpointValue({ base: '20%', md: '30%' }),
									position: 'absolute',
									bottom: 1,
									left: 0,
									bg: 'teal.500',
									zIndex: -1,
								}}>
								with your friends
							</Text>
							<br />
							<Text color={'teal.500'} as={'span'}>
								effortlessly.
							</Text>
						</Heading>
					</Box>
					<Text fontSize={{ base: 'lg', lg: 'xl' }} color={'gray.500'}>
						Host or join a party and add tracks from Spotify to a shared queue.
					</Text>
					<Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
						<Button
							onClick={() => stateService.send("CREATE_ROOM")}
							disabled={!isIdle}
							rounded='lg'
							bg='teal.600'
							color={'white'}
							_active={{ bg: 'teal.800' }}
							_hover={{ bg: 'teal.700' }}
						>
							Host a Party
						</Button>
						<Button disabled={!isIdle} onClick={onOpen} rounded='lg'>Join a Party</Button>
						<JoinPartyModal isOpen={isOpen} onClose={onClose} onSubmit={(pin) => stateService.send({ type: "JOIN_ROOM", roomId: pin })} />
					</Stack>
				</Stack>
			</Flex >
		</Stack >
	);
}

export default Home