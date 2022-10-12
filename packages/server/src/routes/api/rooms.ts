import express from "express";
import { rooms } from "../../models/room";

const router = express.Router();

router.use("/", (_request, response) => {
  rooms.forEach((room, pin) => {
    response
      .status(200)
      .write(
        `${room.name} (${pin.toUpperCase()}) - ${
          room.hostId ? room.hostId.slice(0, 6) : "n/a"
        } - ${room.connections.size} connection(s)\n`
      );
  });
  response.end();
});

export default router;
