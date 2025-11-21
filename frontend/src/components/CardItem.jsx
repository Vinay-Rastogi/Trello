import { Draggable } from "@hello-pangea/dnd";
import styles from "./CardItem.module.css";
import API from "../api/api";
import { useState } from "react";
import CardEditModal from "./CardEditModal";
import { getDueBadge } from "../utils/dueColor";

const CardItem = ({ card, index, listId, setCards }) => {
  const [open, setOpen] = useState(false);

  const deleteCard = async (e) => {
    e.stopPropagation();
    if (!confirm("Delete this card?")) return;

    await API.delete(`/cards/${card._id}`);

    setCards((prev) => ({
      ...prev,
      [listId]: prev[listId].filter((c) => c._id !== card._id),
    }));
  };

  const badge = getDueBadge(card.dueDate);

  return (
    <>
      <Draggable draggableId={card._id} index={index}>
        {(provided) => (
          <div
            className={styles.card}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={() => setOpen(true)}
          >
            <div className={styles.topRow}>
              <strong className={styles.title}>{card.title}</strong>

              <div className={styles.buttons}>
                <button
                  className={styles.editBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(true);
                  }}
                >
                  ✎
                </button>

                <button className={styles.deleteBtn} onClick={deleteCard}>
                  ✕
                </button>
              </div>
            </div>

            {card.description && (
              <p className={styles.desc}>
                {card.description.length > 40
                  ? card.description.slice(0, 40) + "..."
                  : card.description}
              </p>
            )}

            {card.dueDate && (
              <span className={styles.badge} style={{ background: badge.color }}>
                {badge.label}
              </span>
            )}
          </div>
        )}
      </Draggable>

      {open && (
        <CardEditModal
          card={card}
          close={() => setOpen(false)}
          setCards={setCards}
          listId={listId}
        />
      )}
    </>
  );
}

export default CardItem;