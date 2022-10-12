import dotenv from "dotenv";
dotenv.config();

import { createServer } from "./createServer";

const port = Number.parseInt(process.env.PORT!) || 8080;

const server = createServer();

server.listen(port, () => {
  console.log(`Server started on port ${port} :)`);
});
