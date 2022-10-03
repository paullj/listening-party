import { useSelector } from "@xstate/react";
import { MouseEventHandler, useContext, useEffect } from "react";
import Button from "../components/common/Button";
import ErrorMessage from "../components/ErrorMessage";
import { MachineContext } from "../context/MachineProvider";

interface ErrorProps {

}

const Error = (props: ErrorProps) => {
	const { stateService } = useContext(MachineContext)
	const hasFailed = useSelector(stateService, (state) => state.matches("failure"));


	const handleBack: MouseEventHandler<HTMLButtonElement> = async (event) => {
		event.preventDefault();
		stateService.send("RESET")
	}
	const handleRetry: MouseEventHandler<HTMLButtonElement> = async (event) => {
		event.preventDefault();
		stateService.send("RETRY")
	}

	useEffect(() => {
		if (!hasFailed) {
			stateService.send({ type: "RESET" });
		}
	}, [hasFailed, stateService]);


	return (<>
		<ErrorMessage />
		<Button onClick={handleBack}>Back</Button>
		<Button onClick={handleRetry}>Retry</Button>
	</>);
}
export default Error;