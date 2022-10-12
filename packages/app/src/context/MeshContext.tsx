import { createContext, useContext } from "react";
import { meshMachine } from "../machines/mesh";

import type { InterpreterFrom } from "xstate";
import type { PropsWithChildren } from "react";

import { useMeshService } from "../hooks/useMeshService";
import { useMeshReciever } from "../hooks/useMeshReceiver";

type MeshInterpreter = InterpreterFrom<typeof meshMachine>;

const MeshContext = createContext({} as MeshInterpreter);

const MeshProvider = ({ children }: PropsWithChildren) => {
	const meshService = useMeshService();
	useMeshReciever(meshService);

	return (
		<>
			<MeshContext.Provider value={meshService}>
				{children}
			</MeshContext.Provider>
		</>
	);
};

const useMeshContext = () => useContext(MeshContext);

export { MeshContext, MeshProvider, useMeshContext };
export type { MeshInterpreter };
