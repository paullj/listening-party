import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { MachineContext } from "../providers/MachineProvider";

const UserInfo: React.FC<{}> = () => {
	const { userService } = useContext(MachineContext);
	const { userId } = useSelector(userService, (state) => state.context);

	const isConnected = useSelector(userService, (state) => state.matches("connected"));

	return (
		<div className="px-2">
			{!isConnected ? <span className="aspect-square inline-block bg-red w-3 vertical-middle align-center rounded-full" />
				: <span className="aspect-square inline-block bg-green-500 w-3 vertical-middle align-center rounded-full" />}

			<span className="ml1 font-mono text-sm p1 bg-gray-200 rounded">
				{userId.slice(0, 6)}
			</span>
		</div>
	)
}

export default UserInfo;