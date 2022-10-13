import express from "express";

import rooms from "./rooms";
import search from "./search";

const router = express.Router();
router.use("/rooms", rooms);
router.use("/search", search);

export default router;
