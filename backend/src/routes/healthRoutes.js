import express from "express";
import { check } from "../controllers/healthController.js";

const router = express.Router();

router.get("/", check)

export default router