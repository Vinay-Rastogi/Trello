import List from "../models/List.js";

const addDaysISO = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const containsAny = (text, arr) => {
  const t = text.toLowerCase();
  return arr.some((w) => t.includes(w.toLowerCase()));
};

export const generateRecommendations = async (req, res) => {
  const { description = "", allCards = [], boardId } = req.body;

  const desc = description.toLowerCase();
  let suggestedDue = null;

  // Simple time suggestions
  if (containsAny(desc, ["urgent", "asap", "immediately"])) {
    suggestedDue = addDaysISO(0);
  } else if (containsAny(desc, ["today"])) {
    suggestedDue = addDaysISO(0);
  } else if (containsAny(desc, ["tomorrow"])) {
    suggestedDue = addDaysISO(1);
  } else if (containsAny(desc, ["week", "friday"])) {
    suggestedDue = addDaysISO(3);
  } else if (desc.trim().length > 0) {
    suggestedDue = addDaysISO(7);
  }

  // Load lists for movement suggestion
  const lists = boardId ? await List.find({ boardId }) : [];
  let suggestedList = null;

  if (containsAny(desc, ["start", "working", "in progress"])) {
    suggestedList = lists.find((l) =>
      l.title.toLowerCase().includes("progress")
    );
  } else if (containsAny(desc, ["done", "completed", "finished"])) {
    suggestedList = lists.find((l) =>
      l.title.toLowerCase().includes("done")
    );
  } else if (containsAny(desc, ["review"])) {
    suggestedList = lists.find((l) =>
      l.title.toLowerCase().includes("review")
    );
  }

  // Related cards (keyword matching)
  const words = desc.split(/\W+/).filter((w) => w.length > 2);
  let related = [];

  if (words.length > 0 && Array.isArray(allCards)) {
    const scored = allCards.map((c) => {
      const txt = `${c.title} ${c.description}`.toLowerCase();
      let s = 0;
      for (const w of words) if (txt.includes(w)) s++;
      return { card: c, score: s };
    });

    scored.sort((a, b) => b.score - a.score);
    related = scored.filter((s) => s.score > 0).slice(0, 5).map((s) => s.card);
  }

  res.json({
    dueDate: suggestedDue,
    moveTo: suggestedList
      ? { id: suggestedList._id.toString(), title: suggestedList.title }
      : null,
    related
  });
};
