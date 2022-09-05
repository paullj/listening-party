import { createServer } from "./createServer";
import { createServer as createHttpServer } from "http";

const port = Number.parseInt(process.env.PORT!) || 8080;

const httpServer = createHttpServer((req, res) => {
	res.write("Hi!");
	res.end();
});

createServer(port, httpServer);

httpServer.listen(port);
