import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AuthCard.module.css";
import { toast } from "react-toastify";

const Register = () => {
  const { register } = useContext(AuthContext);
  const nav = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });

const submit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.email || !form.password) {
    toast.error("All fields are required!");
    return;
  }

  try {
    await register(form.name, form.email, form.password);
    toast.success("Account created successfully!");

    setTimeout(() => nav("/"), 1200);

  } catch (err) {
    const msg = err.response?.data?.msg;
    console.log(msg);
    if (msg === "User already registered") {
      toast.error("An account with this email already exists!");
    } 
    else {
      toast.error(msg || "Registration failed. Try again.");
    }
  }
};


  return (
    <div className="auth-bg">
      <div className={styles.card}>
        <h2 className={styles.title}>Create Account</h2>

        <form className={styles.form} onSubmit={submit}>
          <input
            className={styles.input}
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className={styles.button}>Create Account</button>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
