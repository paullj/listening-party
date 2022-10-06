import { BrowserRouter, Route, Routes, } from "react-router-dom";

import { StateProvider } from './context/StateContext';
import { SocketProvider } from './context/SocketContext';
import UserInfo from "./components/UserInfo";

import Home from './routes/Home';
import Room from './routes/Room';
import Error from './routes/Error';

function App() {
	return (
		<BrowserRouter>
			<SocketProvider>
				<StateProvider>
					<Routes>
						<Route path="/" element={<Home />}></Route>
						<Route path="/room/:id" element={<Room />}></Route>
						<Route path="/error" element={<Error />}></Route>
					</Routes>
					<UserInfo></UserInfo>

				</StateProvider>
			</SocketProvider>
		</BrowserRouter>
	)
}

export default App