import { useState } from "react";
import styles from "./AddCardModal.module.css";
import API from "../api/api";

const AddCardModal = ({ listId, boardId, close, setCards }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");

  const addCard = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const res = await API.post("/cards", {
      title,
      description: desc,
      dueDate,
      listId,
      boardId,
    });

    // Update UI
    setCards(prev => ({
      ...prev,
      [listId]: [...prev[listId], res.data]
    }));

    close();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Add Card</h3>

        <form onSubmit={addCard}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />

          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className={styles.textarea}
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={styles.input}
          />

          <div className={styles.actions}>
            <button type="button" onClick={close} className={styles.cancel}>Cancel</button>
            <button className={styles.addBtn}>Add Card</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCardModal;