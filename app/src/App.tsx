import { BrowserRouter, Route, Routes, } from "react-router-dom";
import { SWRConfig } from 'swr'

import { MachineProvider } from './components/providers/MachineProvider';
import { SocketProvider } from './components/providers/SocketProvider';
import UserInfo from "./components/UserInfo";

import Home from './routes/Home';
import Room from './routes/Room';

import 'uno.css'
import '@unocss/reset/tailwind.css'
import ErrorMessage from "./components/ErrorMessage";

function App() {
	return (
		<div className="p-2 w-screen h-screen">
			<SWRConfig value={{
				fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
			}}>
				<BrowserRouter>
					<SocketProvider>
						<MachineProvider>
							<div className="w-full h-full flex flex-col">
								<div className="flex-shrink">
									<ErrorMessage />
								</div>
								<div className="flex-grow">
									<Routes>
										<Route path="/" element={<Home />}></Route>
										<Route path="/room/:id" element={<Room />}></Route>
									</Routes>
								</div>
								<div className="flex-shrink">
									<UserInfo></UserInfo>
								</div>
							</div>
						</MachineProvider>
					</SocketProvider>
				</BrowserRouter>
			</SWRConfig>
		</div>
	)
}

export default App