import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createCard,
  getCards,
  updateCard,
    deleteCard
} from "../controllers/cardController.js";

const router = express.Router();

router.post("/", auth, createCard);
router.get("/:listId", auth, getCards);
router.put("/:cardId", auth, updateCard);
router.delete("/:cardId", auth, deleteCard);




export default router;
