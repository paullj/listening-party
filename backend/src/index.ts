import express from "express";
import cors from "cors";

import { createSocketServer, rooms } from "./createServer";
import http from "http";

import childProcess from "child_process";

const revision = childProcess.execSync("git rev-parse HEAD").toString().trim();

const port = Number.parseInt(process.env.PORT!) || 8080;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

app.get("/", (_request, response) => {
	response.write(`Revision ${revision.slice(0, 6)}\n`);
	response.write(`\n`);
	rooms.forEach((room) => {
		response.write(`${room.name} - ${room.connections.size} connection(s)\n`);
	});
	response.end();
});

createSocketServer(server);

server.listen(port, () => {
	console.log(`Server started on port ${port} :)`);
});
