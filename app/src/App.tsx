import { BrowserRouter, Route, Routes, } from "react-router-dom";
import { SWRConfig } from 'swr'

import { MachineProvider } from './providers/MachineProvider';
import { SocketProvider } from './providers/SocketProvider';
import UserInfo from "./components/UserInfo";

import Home from './routes/Home';
import Room from './routes/Room';

import 'uno.css'
import '@unocss/reset/tailwind.css'

function App() {
	return (
		<div className="App">
			<SWRConfig value={{
				fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
			}}>
				<BrowserRouter>
					<SocketProvider>
						<MachineProvider>
							<UserInfo></UserInfo>
							<Routes>
								<Route path="/" element={<Home />}></Route>
								<Route path="/room/:id" element={<Room />}></Route>
							</Routes>
						</MachineProvider>
					</SocketProvider>
				</BrowserRouter>
			</SWRConfig>
		</div>
	)
}

export default App