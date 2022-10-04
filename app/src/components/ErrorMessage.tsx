import { Text, Alert, AlertIcon, AlertTitle, AlertDescription, Badge, Box } from "@chakra-ui/react";
import { useSelector } from "@xstate/react"
import { useContext, useEffect, useState } from "react"
import { MachineContext } from "../context/MachineProvider"

interface ErrorMeta {
	[key: string]: string
}

interface ErrorMessage {
	path: string;
	message: string;
}

const consolidateErrors = (meta: ErrorMeta): ErrorMessage[] => {
	return Object.entries(meta).map(([path, meta]) => ({ path, message: meta }));
}

const ErrorMessage = () => {
	const { stateService } = useContext(MachineContext)
	const failure = useSelector(stateService, (state) => state.matches("failure"))
	const meta = useSelector(stateService, (state) => state.meta)

	const [errors, setErrors] = useState<ErrorMessage[]>([]);

	useEffect(() => {
		setErrors(consolidateErrors(meta));
	}, [meta])

	if (failure)
		return (
			<Alert status='error'>
				<AlertIcon />
				<Box>

					<AlertTitle>Oh no!</AlertTitle>
					<AlertDescription>
						{errors.map(({ path, message }, i) => (
							<>
								<Text as="span">
									{message}
								</Text>
								<Badge variant="subtle" colorScheme="red">{path}</Badge>
							</>
						))}
					</AlertDescription>
				</Box>
			</Alert >
		)
	else
		return (<></>)
}

export default ErrorMessage;