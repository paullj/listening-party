import { WebSocket, WebSocketServer } from "ws";
import { createServer } from "./createServer";

describe("server", function () {
	let server: WebSocketServer;

	beforeEach(() => {
		server = createServer(8080);
	});

	afterEach(() => {
		server.close();
	});

	describe("dummy", function () {
		it("is a fake test", function () {
			let socket = new WebSocket("ws://localhost:8080");
			socket.on("message", (message: string) => {
				console.log(message);
			});
		});
	});
});
