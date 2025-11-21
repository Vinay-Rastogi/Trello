import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createBoard,
  inviteMember,
  getBoards,
  recommendUsers
} from "../controllers/boardController.js";

const router = express.Router();

router.post("/", auth, createBoard);
router.post("/invite", auth, inviteMember);
router.get("/", auth, getBoards);
router.post("/:boardId/recommend", auth, recommendUsers);


export default router;
