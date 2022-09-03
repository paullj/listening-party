import { FC } from "react";
import { useSelector } from "@xstate/react";
import { createPeerService } from "../machines/peer";

const PeerInfo: FC<{ id: string, machine: ReturnType<typeof createPeerService> }> = ({ id, machine }) => {
	const state = useSelector(machine, (state) => state.value);

	return (
		<div>
			<li>
				{`${id.slice(0, 6)}  (${state})`}</li>
		</div>
	)
}

export default PeerInfo;