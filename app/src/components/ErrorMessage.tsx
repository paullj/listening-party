import { useSelector } from "@xstate/react"
import { useContext, useEffect, useState } from "react"
import { MachineContext } from "./providers/MachineProvider"

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
			<div className="rounded-md bg-red-100 px-4 py-2 mb-2">
				<h2 className="text-red-500 font-bold inline">Error!</h2>
				<ul className="inline ml-2">
					{errors.map(({ path, message }, i) =>
						<li className="font-light text-red-900" key={i}>
							{message}
							<span className="font-bold text-red-300 ml-1">{path}</span>
						</li>
					)}
				</ul>
			</div>
		)
	else
		return (<></>)
}

export default ErrorMessage;