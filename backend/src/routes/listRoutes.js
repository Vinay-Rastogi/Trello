import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createList,
  getLists,
    deleteList,
  reorderLists,
} from "../controllers/listController.js";

const router = express.Router();

router.post("/", auth, createList);
router.get("/:boardId", auth, getLists);
router.delete("/:listId", auth, deleteList);
router.post("/reorder", auth, reorderLists);


export default router;
