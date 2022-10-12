import express from "express";

import spotify from "./spotify";

const router = express.Router();
router.use("/spotify", spotify);

export default router;
