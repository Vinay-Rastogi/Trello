import Board from "../models/Board.js";
import User from "../models/User.js";
import List from "../models/List.js";
import Card from "../models/Card.js";

export const createBoard = async (req, res) => {
  const board = await Board.create({
    title: req.body.title,
    owner: req.userId,
    members: [req.userId]
  });

  res.json(board);
};

export const inviteMember = async (req, res) => {
  const { boardId, email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const board = await Board.findById(boardId);
  if (!board) return res.status(404).json({ msg: "Board not found" });

  // Check if already a member
  if (board.members.includes(user._id)) {
    return res.status(400).json({ msg: "User is already a member" });
  }

  // Add user
  board.members.push(user._id);
  await board.save();

  res.json({ msg: "Member added" });
};


export const getBoards = async (req, res) => {
  const boards = await Board.find({
    members: req.userId
  });

  res.json(boards);
};

// export const recommendUsers = async (req, res) => {
//   const { boardId } = req.params;

//   const lists = await List.find({ boardId });
//   let allCards = [];

//   for (const list of lists) {
//     const cards = await Card.find({ listId: list._id });
//     allCards.push(...cards);
//   }

//   // simple rules
//   const urgent = allCards.filter(c =>
//     /urgent|asap|today|now/i.test(c.description || c.title)
//   );

//   const noDueDate = allCards.filter(c => !c.dueDate);

//   const needToMove = allCards.filter(c =>
//     /start|work|progress/i.test(c.description || c.title)
//   );

//   res.json({
//     urgent,
//     noDueDate,
//     needToMove,
//     allCardsCount: allCards.length
//   });
// }

function similarity(a, b) {
  if (!a || !b) return 0;

  a = a.toLowerCase();
  b = b.toLowerCase();

  const wordsA = a.split(/\s+/);
  const wordsB = b.split(/\s+/);

  let matches = 0;
  for (const w of wordsA) {
    if (wordsB.includes(w)) matches++;
  }

  return matches / Math.max(wordsA.length, wordsB.length);
}

// Predict due date from text
function suggestDueDate(text) {
  if (!text) return null;
  text = text.toLowerCase();

  if (/urgent|asap|now|today/.test(text)) {
    return new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours
  }

  if (/tomorrow|tmrw/.test(text)) {
    return new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
  }

  if (/next week|soon|later/.test(text)) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  return null;
}

// Predict suggested movement
function suggestMovement(text) {
  if (!text) return "No movement needed";
  text = text.toLowerCase();

  if (/start|started|working|progress|ongoing/.test(text))
    return "Move to: In Progress";

  if (/done|completed|finished|fixed|resolved/.test(text))
    return "Move to: Done";

  if (/todo|to do|pending|backlog|not started/.test(text))
    return "Move to: To Do";

  return "No movement needed";
}

export const recommendUsers = async (req, res) => {
  const { boardId } = req.params;

  const lists = await List.find({ boardId });
  let allCards = [];

  for (const list of lists) {
    const cards = await Card.find({ listId: list._id });
    allCards.push(...cards);
  }

  let recommendations = [];

  for (const card of allCards) {
    const text = `${card.title} ${card.description || ""}`;

    // Suggested due date
    const dueDate = suggestDueDate(text);

    // Suggested movement
    const movement = suggestMovement(text);

    // Related cards (similarity > 0.3)
    const related = allCards
      .filter((c) => c._id.toString() !== card._id.toString())
      .map((c) => ({
        card: c,
        score: similarity(text, `${c.title} ${c.description || ""}`)
      }))
      .filter((x) => x.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.card);

    recommendations.push({
      id: card._id,
      title: card.title,
      description: card.description,
      suggestedDueDate: dueDate,
      suggestedMovement: movement,
      relatedCards: related
    });
  }

  res.json({
    boardId,
    totalCards: allCards.length,
    recommendations
  });
};