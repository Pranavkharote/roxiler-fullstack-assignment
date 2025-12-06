import { useState } from "react";
import api from "../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function UpdatePassword() {
  const [form, setForm] = useState({
    oldPass: "",
    newPass: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg("");

    if (form.newPass.length < 8) {
      setMsg("password must be 8 chars");
      return;
    }

    api
      .patch("/auth/user/update-password", form)
      .then((res) => {
        setMsg(res.data.msg || "updated");
        toast.success(msg);
        setForm({ oldPass: "", newPass: "" });
      })
      .catch((e) => {
        console.log("update err", e);
        toast.error(msg);
        setMsg(e?.response?.data?.msg || "something wrong");
      });
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-center mb-4">
        Update Password
      </h3>

      {msg && (
        <p className="text-sm text-center mb-3 text-red-500">
          {msg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          name="oldPass"
          value={form.oldPass}
          onChange={handleChange}
          placeholder="Old password"
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-800"
        />

        <input
          type="password"
          name="newPass"
          value={form.newPass}
          onChange={handleChange}
          placeholder="New password"
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-800"
        />

        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition"
        >
          Update Password
        </button>
      </form>

      <ToastContainer />
    </div>
  </div>
);
}
export default UpdatePassword;
