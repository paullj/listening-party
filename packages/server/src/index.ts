import dotenv from "dotenv";
import { createServer } from "./createServer";

dotenv.config();

const port = Number.parseInt(process.env.PORT!) || 8080;

const server = createServer();

server.listen(port, () => {
  console.log(`Server started on port ${port} :)`);
});
