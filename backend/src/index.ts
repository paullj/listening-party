import { createServer } from "./createServer";

const port = Number.parseInt(process.env.PORT!) || 8080;

createServer(port);
