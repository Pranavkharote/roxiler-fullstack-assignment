import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";


export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    // role: "NORMAL_USER".   // fixed role here
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      // normal user signup endpoint
      const res = await api.post("/auth/register", form);
      setMsg(res.data.message || "Account created");
      toast.success(res.data.msg)

      // small delay then go to login
      setTimeout(() => navigate("/"), 800);
    } 
    catch (error) {
  const msg = error?.response?.data?.msg || "Something went wrong";

  // Custom password message
  console.log(error.response)
  if (msg.toLowerCase().includes("pattern")) {
    setErr("Password length should be greater than 8");
    toast.error("Password length should be greater than 8");
  } else {
    setErr(msg);
    toast.error(msg);
  }
}}


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">

      <h2 className="text-xl font-semibold mb-4">Create Account</h2>

      {/* {msg && <p className="text-green-600 mb-2">{msg}</p>}
      {err && <p className="text-red-500 mb-2">{err}</p>} */}

      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="password"
          name="password"
          placeholder="Password (8–16 chars)"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded mb-3"
        />

        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded mb-3"
        />

        {/* role input locked to normal user */}
        <input
          type="hidden"
          name="role"
          // value="NORMAL_USER"
        />

        <button
          type="submit"
          className="w-full py-2 bg-gray-800 text-white rounded mt-2"
        >
          Sign Up
        </button>

        <p className="mt-3 text-sm">
          Already have an account?
          <span
            className="text-blue-600 cursor-pointer ml-1"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </form>
      <ToastContainer/>
    </div>
  );
}
