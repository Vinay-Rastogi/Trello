import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
  listId: { type: mongoose.Schema.Types.ObjectId, ref: "List" }
});

export default mongoose.model("Card", cardSchema);
