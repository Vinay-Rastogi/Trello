import List from "../models/List.js";
import Card from "../models/Card.js";

export const createList = async (req, res) => {
  try {
    const { boardId, title } = req.body;

    if (!boardId || !title) {
      return res.status(400).json({ msg: "boardId and title are required" });
    }

    const count = await List.countDocuments({ boardId });

    const list = await List.create({
      boardId,
      title,
      position: count,
    });

    res.json(list);
  } catch (err) {
    console.error("Create List Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


export const getLists = async (req, res) => {
  const { boardId } = req.params;

  const lists = await List.find({ boardId }).sort({ position: 1 });

  res.json(lists);
};

export const deleteList = async (req, res) => {
  const listId = req.params.listId;

  await Card.deleteMany({ listId });
  await List.findByIdAndDelete(listId);

  res.json({ msg: "List deleted" });
};

export const reorderLists = async (req, res) => {
  const { boardId, orderedIds } = req.body;

  for (let i = 0; i < orderedIds.length; i++) {
    await List.findByIdAndUpdate(orderedIds[i], { position: i });
  }

  res.json({ success: true });
};
