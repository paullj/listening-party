import { BrowserRouter, Route, Routes } from "react-router-dom";

import { RoomProvider } from "./context/RoomContext";
import { SocketProvider } from "./context/SocketContext";
import UserInfo from "./components/home/UserInfo";

import Home from "./routes/Home";
import Room from "./routes/Room";
import Error from "./routes/Error";
import { FeedProvider } from "./context/FeedContext";
import { MeshProvider } from "./context/MeshContext";
import { QueueProvider } from "./context/QueueContext";

function App() {
	return (
		<BrowserRouter>
			<SocketProvider>
				<RoomProvider>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route
							path="/room/:id"
							element={
								<QueueProvider>
									<FeedProvider>
										<MeshProvider>
											<Room />
										</MeshProvider>
									</FeedProvider>
								</QueueProvider>
							}
						/>
						<Route path="/error" element={<Error />} />
					</Routes>
				</RoomProvider>
			</SocketProvider>
		</BrowserRouter>
	);
}

export default App;
