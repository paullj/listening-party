import { useContext } from "react";
import { Badge, Stack } from "@chakra-ui/react";
import { useSelector } from "@xstate/react";
import { MachineContext } from "../context/MachineProvider";

const UserInfo = () => {
	const { stateService } = useContext(MachineContext);
	const userId = useSelector(stateService, (state) => state.context.userId);
	const states = useSelector(stateService, (state) => state.toStrings())

	const isDisconnected = useSelector(stateService, (state) => state.matches("initial"));

	return (
		<Stack position="absolute" bottom={2} left={2} direction="row" alignItems="center" >
			<Badge rounded="full" w={3} h={3} bg={isDisconnected ? "red.400" : "green.400"} />
			<Badge variant="outline" rounded="md" px={1.5}>{userId.slice(0, 6)}</Badge>
			{states.map((state, i) => <Badge key={i} px={1.5} rounded="md" variant='outline'>{state}</Badge>)}
		</Stack>
	)
}

export default UserInfo;