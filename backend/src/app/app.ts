// import express from "express";
// import cors from "cors";

// import { createServer, rooms } from "../createServer";
// import http from "http";

// const port = Number.parseInt(process.env.PORT!) || 8080;

// const app = express();
// const server = http.createServer(app);

// app.use(express.json());
// app.use(cors());

// app.get("/", (_request, response) => {
// 	rooms.forEach((room) => {
// 		response.write(`${room.name} - ${room.connections.size} connection(s)`);
// 	});
// 	response.end();
// });

// createServer(port, server);

// server.listen(port, () => {
// 	console.log(`Server started on port ${port} :)`);
// });
