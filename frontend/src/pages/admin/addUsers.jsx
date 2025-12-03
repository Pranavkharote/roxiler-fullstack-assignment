import { useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "NORMAL_USER",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/admin/add-user", form);
      setMessage(res.data.message);

      // after creation, send admin to user list
      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating user");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Add New User</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Full Name (20–60 characters)"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password (8–16 chars, uppercase + special char)"
          value={form.password}
          onChange={handleChange}
          required
        />

        <textarea
          name="address"
          placeholder="Address (max 400 characters)"
          value={form.address}
          onChange={handleChange}
          required
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="SYSTEM_ADMIN">System Admin</option>
          <option value="NORMAL_USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>

        <button type="submit">Create User</button>
      </form>
    </div>
  );
}
