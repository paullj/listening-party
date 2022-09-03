import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { MachineContext } from "../providers/MachineProvider";
import PeerInfo from "./PeerInfo";

const MeshInfo: React.FC<{}> = () => {
	const { meshService } = useContext(MachineContext);
	const mesh = useSelector(meshService, (state) => state.context.mesh);
	const peerIds = useSelector(meshService, (state) => [...state.context.mesh.keys()]);

	return (
		<div>
			<h2 className="underline mt-4">Connections ({mesh.size})</h2>
			<ul>
				{peerIds.map((id) => <PeerInfo key={id} id={id} machine={mesh.get(id)!}></PeerInfo>)}
			</ul>
		</div>
	)
}

export default MeshInfo;