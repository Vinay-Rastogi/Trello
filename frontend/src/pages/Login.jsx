import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AuthCard.module.css";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const submit = async (e) => {
  e.preventDefault();

  if (!email || !pass) {
    toast.warning("Email and password are required!");
    return;
  }

  try {
    await login(email, pass);
    toast.success("Login successful!");

    setTimeout(() => {
      nav("/dashboard");
    }, 800);

  } catch (err) {
    toast.error(err.response?.data?.msg || "Login failed. Please try again.");
  }
};

  return (
    <div className="auth-bg">
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back</h2>

        <form className={styles.form} onSubmit={submit}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />

          <button className={styles.button}>Login</button>
        </form>

        <p className={styles.footerText}>
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;