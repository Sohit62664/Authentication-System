
import { useState } from "react";
import "./App.css";

function App() {

  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  const API = "http://localhost:5000/api/auth";

  // Register or Login
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const endpoint = mode === "register" ? "register" : "login";

    const body = mode === "register"
      ? { username, email, password }
      : { email, password };

    try {
      const response = await fetch(`${API}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(body)
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok && mode === "login") {
        getProfile();
      }

    } catch (error) {
      setMessage("Server Connection Failed");
    }
  }

  // Fetch Profile
  async function getProfile() {
    try {
      const response = await fetch(`${API}/profile`, {
        credentials: "include"
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        setUser(null);
        setMessage(data.message);
      }

    } catch (error) {
      setMessage("Cannot fetch profile");
    }
  }

  // Logout
  async function handleLogout() {
    try {
      const response = await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include"
      });

      const data = await response.json();

      if (response.ok) {
        setUser(null);
        setMessage(data.message);
        setPassword("");
      }

    } catch (error) {
      setMessage("Cannot logout");
    }
  }

  return (
    <div className="container">

      <h1>Authentication App</h1>

      {user ? (
        <div>
          <h2>Welcome, {user.username}</h2>
          <p>Email: {user.email}</p>

          <button onClick={getProfile}>
            Refresh Profile
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>

          <h2>
            {mode === "login" ? "Login" : "Register"}
          </h2>

          {mode === "register" && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            {mode === "login" ? "Login" : "Register"}
          </button>

          <p>
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setMessage("");
              }}
            >
              {mode === "login" ? "Register" : "Login"}
            </button>
          </p>

        </form>
      )}

      {message && <p className="message">{message}</p>}

    </div>
  );
}

export default App;
