import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { RoomProvider } from "./context/RoomContext";
import { SocketProvider } from "./context/SocketContext";
import UserInfo from "./components/home/UserInfo";

import { FeedProvider } from "./context/FeedContext";
import { MeshProvider } from "./context/MeshContext";
import { QueueProvider } from "./context/QueueContext";

const HomePage = lazy(() => import("./routes/Home"));
const RoomPage = lazy(() => import("./routes/Room"));
const ErrorPage = lazy(() => import("./routes/Error"));

function App() {
	return (
		<BrowserRouter>
			<SocketProvider>
				<RoomProvider>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route
							path="/room/:id"
							element={
								<QueueProvider>
									<FeedProvider>
										<MeshProvider>
											<RoomPage />
										</MeshProvider>
									</FeedProvider>
								</QueueProvider>
							}
						/>
						<Route path="/error" element={<ErrorPage />} />
					</Routes>
				</RoomProvider>
			</SocketProvider>
		</BrowserRouter>
	);
}

export default App;
