import { BrowserRouter, Route, Routes, } from "react-router-dom";

import { MachineProvider } from './context/MachineProvider';
import { SocketProvider } from './context/SocketProvider';
import UserInfo from "./components/UserInfo";

import Home from './routes/Home';
import Room from './routes/Room';
import Error from './routes/Error';

function App() {
	return (
		<BrowserRouter>
			<SocketProvider>
				<MachineProvider>
					<Routes>
						<Route path="/" element={<Home />}></Route>
						<Route path="/room/:id" element={<Room />}></Route>
						<Route path="/error" element={<Error />}></Route>
					</Routes>
					<UserInfo></UserInfo>

				</MachineProvider>
			</SocketProvider>
		</BrowserRouter>
	)
}

export default App