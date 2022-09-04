import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { MachineContext } from "./providers/MachineProvider";

const UserInfo: React.FC<{}> = () => {
	const { stateService } = useContext(MachineContext);
	const userId = useSelector(stateService, (state) => state.context.userId);
	const states = useSelector(stateService, (state) => state.toStrings())

	const isDisconnected = useSelector(stateService, (state) => state.matches("initial"));

	return (
		<div className="px-2">
			{isDisconnected ? <span className="aspect-square inline-block bg-red w-3 vertical-middle align-center rounded-full" />
				: <span className="aspect-square inline-block bg-green-500 w-3 vertical-middle align-center rounded-full" />}

			<span className="ml-1 font-mono text-sm p-1 bg-gray-200 rounded">
				{userId.slice(0, 6)}
			</span>
			<ul className='mt-4 inline font-mono text-sm'>
				{states.map((state, i) => <li key={i} className='inline bg-gray-200 rounded mx-1 p-1'>{state}</li>)}
			</ul>
		</div>
	)
}

export default UserInfo;