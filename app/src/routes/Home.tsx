import { useSelector } from '@xstate/react';
import { Box, Button, Flex, Heading, Stack, Text, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import Confetti from 'react-confetti'

import { useStateContext } from '../context/StateContext';
import JoinPartyModal from '../components/JoinPartyModal';
import { useWindowSize } from '../hooks/useWindowSize';

const Home = () => {
	const stateService = useStateContext();
	const isIdle = useSelector(stateService, (state) => state.matches("idle"));
	const { isOpen, onClose, onOpen } = useDisclosure();
	const { width, height } = useWindowSize();

	return (
		<Box>
			{/* <Confetti numberOfPieces={(width * height) / 10000} width={width} height={height} gravity={0.015}
				confettiSource={{
					x: 0, y: 0, w: width, h: height / 2
				}}
				drawShape={ctx => {
					ctx.beginPath()
					for (let x = 0; x < 10; x++) {
						const y = Math.cos(x)
						ctx.lineTo(x, y)
					}
					ctx.stroke()
					ctx.closePath()
				}} /> */}

			<Flex minH="100vh" p={8} flex={1} align={'center'} justify={'center'}>
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
									bg: 'purple.300',
									zIndex: -1,
								}}>
								with your friends
							</Text>
							<br />
							<Text color={'purple.400'} as={'span'}>
								effortlessly.
							</Text>
						</Heading>
					</Box>
					<Text fontSize={{ base: 'lg', lg: 'xl' }} color={'gray.500'}>
						Host or join a party and add tracks from <Text as="span" color="black" fontWeight="semibold">Spotify</Text>, <Text as="span" color="black" fontWeight="semibold">Youtube</Text> or <Text as="span" color="black" fontWeight="semibold">Deezer</Text> to a shared queue.
					</Text>
					<Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
						<Button
							onClick={() => stateService.send("CREATE_ROOM")}
							disabled={!isIdle}
							rounded='lg'
							bg='purple.300'
							_active={{ bg: 'purple.500' }}
							_hover={{ bg: 'purple.400' }}
						>
							Host a Party
						</Button>
						<Button disabled={!isIdle} onClick={onOpen} rounded='lg'>Join a Party</Button>
						<JoinPartyModal isOpen={isOpen} onClose={onClose} onSubmit={(pin) => stateService.send({ type: "JOIN_ROOM", roomId: pin })} />
					</Stack>
				</Stack>
			</Flex >
		</Box>
	);
}

export default Home