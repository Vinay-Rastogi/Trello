import Card from "../models/Card.js";

export const createCard = async (req, res) => {
  const card = await Card.create(req.body);
  res.json(card);
};

export const getCards = async (req, res) => {
  const cards = await Card.find({ listId: req.params.listId });
  res.json(cards);
};

export const updateCard = async (req, res) => {
  const updated = await Card.findByIdAndUpdate(req.params.cardId, req.body, {
    new: true,
  });

  res.json(updated);
};

export const deleteCard = async (req, res) => {
  await Card.findByIdAndDelete(req.params.cardId);
  res.json({ msg: "Card deleted" });
};
