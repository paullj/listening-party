import { BrowserRouter, Route, Routes, } from "react-router-dom";
import { SWRConfig } from 'swr'

import { MachineProvider } from './components/providers/MachineProvider';
import { SocketProvider } from './components/providers/SocketProvider';
import UserInfo from "./components/UserInfo";

import Home from './routes/Home';
import Room from './routes/Room';

import 'uno.css'
import '@unocss/reset/tailwind.css'

function App() {
	return (
		<div className="p-2 w-screen h-screen">
			<SWRConfig value={{
				fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
			}}>
				<BrowserRouter>
					<SocketProvider>
						<MachineProvider>
							<Routes>
								<Route path="/" element={<Home />}></Route>
								<Route path="/room/:id" element={<Room />}></Route>
							</Routes>
							<UserInfo></UserInfo>
						</MachineProvider>
					</SocketProvider>
				</BrowserRouter>
			</SWRConfig>
		</div>
	)
}

export default App