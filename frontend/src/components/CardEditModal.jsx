import { useState } from "react";
import styles from "./CardEditModal.module.css";
import API from "../api/api";

const CardEditModal = ({ card, close, setCards, listId }) => {
  const [title, setTitle] = useState(card.title);
  const [desc, setDesc] = useState(card.description || "");
  const [dueDate, setDueDate] = useState(
    card.dueDate ? card.dueDate.substring(0, 10) : ""
  );

  const save = async (e) => {
    e.preventDefault();

    const res = await API.put(`/cards/${card._id}`, {
      title,
      description: desc,
      dueDate,
    });

    // update UI
    setCards((prev) => ({
      ...prev,
      [listId]: prev[listId].map((c) =>
        c._id === card._id ? res.data : c
      ),
    }));

    close();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Edit Card</h3>

        <form onSubmit={save}>
          <label>Title</label>
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description</label>
          <textarea
            className={styles.textarea}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <label>Due Date</label>
          <input
            type="date"
            className={styles.input}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <div className={styles.actions}>
            <button
              type="button"
              onClick={close}
              className={styles.cancel}
            >
              Cancel
            </button>

            <button className={styles.saveBtn}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CardEditModal;