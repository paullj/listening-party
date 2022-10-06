import { Button, Container, Flex, IconButton } from "@chakra-ui/react";
import { ResetIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useSelector } from "@xstate/react";
import { MouseEventHandler, useContext, useEffect } from "react";

import ErrorMessage from "../components/ErrorMessage";
import { StateContext, useStateContext } from "../context/StateContext";

const Error = () => {
	const stateService = useStateContext();
	const hasFailed = useSelector(stateService, (state) => state.matches("failure"));

	useEffect(() => {
		if (!hasFailed) {
			stateService.send({ type: "RESET" });
		}
	}, [hasFailed, stateService]);


	return (<>
		<Container h="100vh">
			<IconButton bg="red.300" _hover={{ bg: "red.400" }} _active={{ bg: "red.500" }} aria-label='Reset' icon={<ResetIcon />} onClick={() => stateService.send("RESET")} />
			<IconButton ml={2} aria-label='Retry' icon={<ReloadIcon />} onClick={() => stateService.send("RETRY")} />
			<ErrorMessage />
		</Container>
	</>);
}
export default Error;