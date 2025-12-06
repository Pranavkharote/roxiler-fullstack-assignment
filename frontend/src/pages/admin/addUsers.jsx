import React, { useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

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
      setMessage(res.data.message || "User created");
      toast.success(res.data.message);
      console.log(res.data);
      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch (err) {
      const msg = err?.response?.data?.msg || "Something went wrong";

      // Custom password message
      // console.log(err.response)
      if (msg.toLowerCase().includes("pattern")) {
        setMessage("Password length should be greater than 8");
        toast.error("Password length should be greater than 8");
      } else {
        setMessage(msg);
        toast.error(msg);
        // setMessage(err.response?.data?.message || "Error creating user")
        // toast.error(err.response.data.msg);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add New User</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="SYSTEM_ADMIN">System Admin</option>
          <option value="NORMAL_USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>

        <button
          type="submit"
          className="w-full py-2 bg-gray-800 text-white rounded"
        >
          Create User
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
