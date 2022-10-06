import { BrowserRouter, Route, Routes } from "react-router-dom";

import { RoomProvider } from "./context/RoomContext";
import { SocketProvider } from "./context/SocketContext";
import UserInfo from "./components/UserInfo";

import Home from "./routes/Home";
import Room from "./routes/Room";
import Error from "./routes/Error";

function App() {
	return (
		<BrowserRouter>
			<SocketProvider>
				<RoomProvider>
					<Routes>
						<Route path="/" element={<Home />}></Route>
						<Route path="/room/:id" element={<Room />}></Route>
						<Route path="/error" element={<Error />}></Route>
					</Routes>
				</RoomProvider>
			</SocketProvider>
		</BrowserRouter>
	);
}

export default App;
