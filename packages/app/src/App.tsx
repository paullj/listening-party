import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { RoomProvider } from "./context/RoomContext";
import { SocketProvider } from "./context/SocketContext";
import UserInfo from "./components/home/UserInfo";

import { FeedProvider } from "./context/FeedContext";
import { MeshProvider } from "./context/MeshContext";
import { QueueProvider } from "./context/QueueContext";

import HomePage from "./routes/Home";
import RoomPage from "./routes/Room";
import ErrorPage from "./routes/Error";
// const RoomPage = lazy(() => import("./routes/Room"));

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
