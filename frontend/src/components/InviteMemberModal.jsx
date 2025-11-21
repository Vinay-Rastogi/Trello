import { useState } from "react";
import API from "../api/api";
import styles from "./InviteMemberModal.module.css";
import { toast } from "react-toastify";

const InviteMemberModal = ({ boardId, close }) => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const invite = async () => {
  if (!email.trim()) {
    toast.warning("Please enter an email!");
    return;
  }

  try {
    await API.post("/boards/invite", {
      boardId,
      email
    });

    toast.success("User invited successfully!");
    setEmail("");
    close();

  } catch (err) {
    const msg = err.response?.data?.msg;

    if (msg === "User not found") {
      toast.error("No account exists with this email.");
    } 
    else if (msg === "User is already a member") {
      toast.info("This user is already part of the board.");
    }
    else {
      toast.error(msg || "Failed to invite user.");
    }
  }
};

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Invite Member</h3>

        <input
          className={styles.input}
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {msg && <p className={styles.msg}>{msg}</p>}

        <div className={styles.actions}>
          <button onClick={close} className={styles.cancel}>
            Cancel
          </button>
          <button onClick={invite} className={styles.invite}>
            Invite
          </button>
        </div>
      </div>
    </div>
  );
}

export default InviteMemberModal;
