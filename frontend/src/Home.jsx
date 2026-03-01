import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to E-Commerce Platform</h1>

      <div style={styles.buttonContainer}>
        <button
          style={styles.loginBtn}
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        <button
          style={styles.signupBtn}
          onClick={() => navigate("/signup")}
        >
          Register
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5"
  },
  title: {
    marginBottom: "40px",
    fontSize: "28px"
  },
  buttonContainer: {
    display: "flex",
    gap: "20px"
  },
  loginBtn: {
    padding: "12px 25px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px"
  },
  signupBtn: {
    padding: "12px 25px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px"
  }
};