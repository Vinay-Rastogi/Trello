import { useEffect, useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import API from "../api/api";
import styles from "./Dashboard.module.css";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Dashboard = () => {
  const nav = useNavigate();
  const [boards, setBoards] = useState([]);
  const [newBoard, setNewBoard] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const { user, loading, logout } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" replace />;

  const loadBoards = async () => {
    const res = await API.get("/boards");
    console.log(res);
    setBoards(res.data);
  };

  useEffect(() => {
    loadBoards();
  }, []);

  const createBoard = async (e) => {
  e.preventDefault();

  if (!newBoard.trim()) {
    toast.warning("Board name cannot be empty!");
    return;
  }

  try {
    const res = await API.post("/boards", { title: newBoard });

    setBoards((prev) => [...prev, res.data]);
    toast.success("Board created successfully!");

    setNewBoard("");
    setShowCreate(false);

  } catch (err) {
    toast.error(
      err.response?.data?.msg || "Failed to create board. Try again."
    );
  }
};
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <h1 className={styles.heading}>Your Boards</h1>

          <div className={styles.actions}>
            <button
              className={styles.createMainBtn}
              onClick={() => setShowCreate(true)}
            >
              + Create Board
            </button>

            <button
              className={styles.logoutBtn}
              onClick={() => {
                logout();
                toast.success("Logged out successfully!");
                setTimeout(() => nav("/"), 600);
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.addCard} onClick={() => setShowCreate(true)}>
            <span>+</span>
            <p>Create New Board</p>
          </div>

          {boards.map((b) => (
            <div
              key={b._id}
              className={styles.boardCard}
              onClick={() => nav(`/board/${b._id}`)}
            >
              <div className={styles.boardThumbnail}></div>
              <p>{b.title}</p>
            </div>
          ))}
        </div>

        {showCreate && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Create New Board</h3>
              <form onSubmit={createBoard}>
                <input
                  className={styles.modalInput}
                  placeholder="Board name"
                  value={newBoard}
                  onChange={(e) => setNewBoard(e.target.value)}
                />
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setShowCreate(false)}
                  >
                    Cancel
                  </button>
                  <button className={styles.saveBtn}>Create</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
