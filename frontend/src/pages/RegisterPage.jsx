import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("register/", {
        username,
        email,
        password,
      });

      alert("Account created successfully");

      navigate("/");
    } catch (error) {

        const data = error.response?.data;

        if (data?.username) {
            alert(data.username[0]);
        }
        else if (data?.email) {
            alert(data.email[0]);
        }
        else if (data?.password) {
            alert(data.password[0]);
        }
        else {
            alert("Registration failed");
        }

    } 
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">

          <h2 className="mb-4">
            Create Account
          </h2>

          <input
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="btn btn-success w-100"
            onClick={handleRegister}
          >
            Create Account
          </button>

        </div>
      </div>
    </div>
  );
}

export default RegisterPage;