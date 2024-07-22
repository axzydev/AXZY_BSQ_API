import express from "express";
import { uploadDocument } from "./files.controller";

const router = express.Router();

router.post("/", uploadDocument);

export default router;
