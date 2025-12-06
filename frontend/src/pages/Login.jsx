import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { logOut } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);

      // Save token + user in AuthContext (and localStorage)
      login(res.data.user, res.data.token);

      const role = res.data.user.role;

      // Redirect based on role
      if (role === "SYSTEM_ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "STORE_OWNER") {
        navigate("/owner/dashboard");
      } else {
        navigate("/user/stores");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      {error && <p className="text-red-300">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
          required
         className="w-full border p-2 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          required
        className="w-full border p-2 rounded mt-4"
        />

        <button
          type="submit"
         className="w-full py-2 bg-gray-800 text-white rounded mt-4"
        >
          Login
        </button>
        <p className="mt-3 text-sm">
          Don't have an account?
          <span
            className="text-blue-600 cursor-pointer ml-1"
            onClick={() => navigate("/register")}
          >
            Create Account
          </span>
          </p>
        <button  className="w-full py-2 text-blue-600 rounded" onClick={() => navigate("/user/update-password")}>
  Update Password
</button>

      </form>
    </div>
  );
}
