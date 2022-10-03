import express from "express";
import cors from "cors";

import { createSocketServer, rooms } from "./createServer";
import http from "http";

const port = Number.parseInt(process.env.PORT!) || 8080;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

app.get("/", (_request, response) => {
	rooms.forEach((room) => {
		response.write(`${room.name} - ${room.connections.size} connection(s)\n`);
	});
	response.end();
});

createSocketServer(server);

server.listen(port, () => {
	console.log(`Server started on port ${port} :)`);
});
