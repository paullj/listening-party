import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import router from "./routes";
import { createSocketServer } from "./sockets";
import http from "http";

import path from "path";

const createServer = () => {
  const production = process.env.NODE_ENV === "production";
  const app = express();
  const server = http.createServer(app);

  app.use(bodyParser.json());
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors());

  app.use(router);

  createSocketServer(server);

  if (production) {
    const appDir = path.join(__dirname, "../../", "app");
    app.use(express.static(path.join(appDir, "dist")));
    app.use(express.static(path.join(appDir, "public")));

    app.get("*", (_, response) => {
      response.sendFile(path.resolve(appDir, "dist", "index.html"));
    });
  }

  return server;
};

export { createServer };
