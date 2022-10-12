import express from "express";

import auth from "./auth";
import api from "./api";

const router = express.Router();

router.use("/api", api);
router.use("/auth", auth);

export default router;
