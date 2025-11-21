import { Droppable, Draggable } from "@hello-pangea/dnd";
import styles from "./ListColumn.module.css";
import CardItem from "./CardItem";
import AddCardModal from "./AddCardModal";
import API from "../api/api";
import { useState } from "react";
import { toast } from "react-toastify";

const ListColumn = ({ list, index, cards, setCards, setLists }) => {
  const [title, setTitle] = useState("");
  const [showModal, setShowModal] = useState(false);

  const addCard = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const res = await API.post("/cards", {
      title,
      listId: list._id,
      boardId: list.boardId,
    });

    setCards((prev) => ({
      ...prev,
      [list._id]: [...prev[list._id], res.data],
    }));

    setTitle("");
  };

  const deleteList = async () => {
  if (!confirm("Delete this list and all its cards?")) {
    toast.info("List deletion cancelled.");
    return;
  }

  try {
    await API.delete(`/lists/${list._id}`);

    // remove list
    setLists((prev) => prev.filter((l) => l._id !== list._id));

    //remove associated cards
    setCards((prev) => {
      const updated = { ...prev };
      delete updated[list._id];
      return updated;
    });

    toast.success("List deleted successfully!");

  } catch (err) {
    toast.error(
      err.response?.data?.msg || "Failed to delete list. Try again."
    );
  }
};

  return (
    <Draggable draggableId={list._id} index={index}>
      {(provided) => (
        <div
          className={styles.list}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className={styles.header} {...provided.dragHandleProps}>
            <h3>{list.title}</h3>
            <button className={styles.deleteBtn} onClick={deleteList}>
              ✕
            </button>
          </div>

          <Droppable droppableId={list._id} type="CARD">
            {(provided) => (
              <div
                className={styles.cards}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {Array.from(new Map(cards.map((c) => [c._id, c])).values()).map(
                  (card, idx) => (
                    <CardItem
                      key={card._id}
                      card={card}
                      index={idx}
                      listId={list._id}
                      setCards={setCards}
                    />
                  )
                )}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <form onSubmit={addCard}>
            <button
              className={styles.addBtn}
              onClick={() => setShowModal(true)}
            >
              + Add Card
            </button>
          </form>
          {showModal && (
            <AddCardModal
              listId={list._id}
              boardId={list.boardId}
              close={() => setShowModal(false)}
              setCards={setCards}
            />
          )}
        </div>
      )}
    </Draggable>
  );
}

export default ListColumn;
