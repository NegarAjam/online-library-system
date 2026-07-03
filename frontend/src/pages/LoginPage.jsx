import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post("login/", {
        username,
        password,
      });

      console.log("LOGIN RESPONSE:", response.data);
      console.log("ROLE =", response.data.user.role);
      // =========================
      // ذخیره توکن‌ها
      // =========================
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      // =========================
      // چک کردن اینکه user و role وجود دارد یا نه
      // =========================
      const user = response.data.user;

      if (user && user.role) {
        localStorage.setItem("role", user.role);
      }

      alert("Login successful");

      // =========================
      // هدایت بر اساس role
      // =========================
        const role = user?.role?.toLowerCase();

        if (role === "admin") {
            navigate("/admin-dashboard");
        } else {
            navigate("/dashboard");
        }

    } catch (error) {

      const data = error.response?.data;

      console.log("LOGIN ERROR:", data);

      if (data?.detail) {
        alert(data.detail);
      }
      else if (error.response?.status === 401) {
        alert("Invalid username or password");
      }
      else if (data) {
        alert(JSON.stringify(data));
      }
      else {
        alert("Server error");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">

          <h2 className="mb-4">Login</h2>

          <input
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="btn btn-primary w-100"
            onClick={handleLogin}
          >
            Login
          </button>

          <div className="text-center mt-3">
            <Link to="/register">
              Create Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;