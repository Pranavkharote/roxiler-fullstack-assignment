import { useState } from "react";
import api from "../api/axiosInstance";

function UpdatePassword() {

  const [form, setForm] = useState({
    oldPass: "",
    newPass: ""
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg("");

    if (form.newPass.length < 8) {
      setMsg("password must be 8 chars");
      return;
    }

    api.patch("/auth/user/update-password", form)
      .then((res) => {
        setMsg(res.data.msg || "updated");
        setForm({ oldPass: "", newPass: "" });
      })
      .catch((e) => {
        console.log("update err", e);
        setMsg(e?.response?.data?.msg || "something wrong");
      });
  };

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h3>Update Password</h3>

      {msg && <p>{msg}</p>}

      <form onSubmit={handleSubmit} style={{ display:"grid", gap:"10px" }}>

        <input
          type="password"
          name="oldPass"
          value={form.oldPass}
          onChange={handleChange}
          placeholder="Old password"
        />

        <input
          type="password"
          name="newPass"
          value={form.newPass}
          onChange={handleChange}
          placeholder="New password"
        />

        <button type="submit" style={{ padding: "8px 12px" }}>
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdatePassword;
