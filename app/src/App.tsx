import { BrowserRouter, Route, Routes, } from "react-router-dom";

import { MachineProvider } from './context/MachineProvider';
import { SocketProvider } from './context/SocketProvider';
import UserInfo from "./components/UserInfo";

import Home from './routes/Home';
import Room from './routes/Room';
import Error from './routes/Error';

import 'uno.css'
import '@unocss/reset/tailwind.css'

function App() {
	return (
		<div className="p-2 w-screen h-screen">
			<BrowserRouter>
				<SocketProvider>
					<MachineProvider>
						<div className="w-full h-full flex flex-col">
							<div className="flex-grow">
								<Routes>
									<Route path="/" element={<Home />}></Route>
									<Route path="/room/:id" element={<Room />}></Route>
									<Route path="/error" element={<Error />}></Route>
								</Routes>
							</div>
							<div className="flex-shrink">
								<UserInfo></UserInfo>
							</div>
						</div>
					</MachineProvider>
				</SocketProvider>
			</BrowserRouter>
		</div>
	)
}

export default App