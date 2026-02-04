import { Router } from "express";
import {
  createBingo,
  joinBingo,
  drawNumber,
  markNumber,
  deleteBingoController,
  getBingos,
  finishBingo
} from "../controllers/bingoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = Router();

// Admin
router.post("/create", authMiddleware, adminOnly, createBingo);
router.delete("/:id", authMiddleware, adminOnly, deleteBingoController);
router.post("/:id/draw", authMiddleware, adminOnly, drawNumber);

// Usuário
router.post("/:id/join", authMiddleware, joinBingo);
router.post("/:id/mark", authMiddleware, markNumber);
router.get("/", authMiddleware, getBingos);
router.patch("/:id/finish", authMiddleware, finishBingo) 

export default router;
