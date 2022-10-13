import type { SocketEventHandler } from "../../models/socket";
import { sendInRoom } from "../sendInRoom";

const sendAnswer: SocketEventHandler<"SendAnswer"> = (
  userId,
  _socket,
  data
) => {
  sendInRoom(
    "RecieveAnswer",
    data.roomId,
    data.to,
    {
      from: userId,
      answer: data.answer,
    },
    false
  );
};

export { sendAnswer };
