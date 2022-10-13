import { createContext, useContext, useState } from "react";
import { WebSocketDispatcher } from "../helpers/WebSocketDispatcher";

import type { PropsWithChildren } from "react";
import type { SocketEventType, SocketEventDataMap } from "../models/socket";

const getDispatcher = () => {
  const socketProtocol =
    window.location.protocol === "https:" ? "wss://" : "ws://";
  let socketEndpoint = `${socketProtocol}${window.location.host}/ws`;

  const socketId = localStorage.getItem("socketId");
  if (socketId) {
    socketEndpoint += `/${socketId}`;
  }
  console.log(socketEndpoint);
  return new WebSocketDispatcher<SocketEventDataMap>(socketEndpoint);
};

const socket = getDispatcher();

type Callback<T extends SocketEventType> = (
  data: SocketEventDataMap[T]
) => void;

const SocketContext = createContext({
  socket,
  reconnect: () => {},
});

const SocketProvider = ({ children }: PropsWithChildren) => {
  const [dispatcher, setDispatcher] = useState(socket);

  const handleReconnect = () => {
    const newDispatcher = getDispatcher();
    setDispatcher(newDispatcher);
  };

  return (
    <SocketContext.Provider
      value={{ socket: dispatcher, reconnect: handleReconnect }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const useSocketContext = () => useContext(SocketContext);

export { SocketContext, SocketProvider, useSocketContext };
export type { Callback };
