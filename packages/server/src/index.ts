import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import router from "./routes";
import { createSocketServer, rooms } from "./createServer";
import http from "http";

import { getSearch } from "./search";
import path from "path";

const port = Number.parseInt(process.env.PORT!) || 8080;
const production = process.env.NODE_ENV === "production";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

app.use(router);

// app.get("/api/rooms", (_request, response) => {
// 	rooms.forEach((room, pin) => {
// 		response.write(
// 			`${room.name} (${pin.toUpperCase()}) - ${
// 				room.hostId ? room.hostId.slice(0, 6) : "n/a"
// 			} - ${room.connections.size} connection(s)\n`
// 		);
// 	});
// 	response.end();
// });

// app.get("/api/search/:query", getSearch);

createSocketServer(server);

if (production) {
	const appDir = path.join(__dirname, "../../", "app");

	app.use(express.static(path.join(appDir, "dist")));
	app.use(express.static(path.join(appDir, "public")));
}

server.listen(port, () => {
	console.log(`Server started on port ${port} :)`);
});
