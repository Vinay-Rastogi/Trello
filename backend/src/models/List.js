import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
  title: String,
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
  position: {
  type: Number,
  required: true,
  default: 0,
}

});

export default mongoose.model("List", listSchema);
