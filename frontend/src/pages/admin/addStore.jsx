import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function AddStore() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: ""
  });

  const [owners, setOwners] = useState([]);
  const [loadingOwners, setLoadingOwners] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch store owners (role = STORE_OWNER)
  useEffect(() => {
    let mounted = true;
    setLoadingOwners(true);
    api.get("/admin/get-users?role=STORE_OWNER")
      .then(res => {
        if (!mounted) return;
        // API returns { users: [...] } where each user contains id, name, email, role...
        setOwners(res.data.users || []);
        // if there is at least one owner, preselect first to avoid empty owner_id
        if ((res.data.users || []).length > 0) {
          setForm(prev => ({ ...prev, owner_id: res.data.users[0].id }));
        }
      })
      .catch(err => {
        console.error("Failed to fetch owners:", err);
        setError("Failed to load store owners. Make sure you have created a store owner.");
      })
      .finally(() => setLoadingOwners(false));
    return () => { mounted = false; }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");

    // basic client-side validation
    if (!form.name.trim() || !form.address.trim() || !form.owner_id) {
      setError("Name, address and owner are required.");
      return;
    }

    try {
      const res = await api.post("/admin/add-store", form);
      setMessage(res.data?.message || "Store created successfully");
      // redirect to stores list after short delay
      setTimeout(() => navigate("/admin/stores"), 900);
    } catch (err) {
      console.error("Add store failed:", err);
      setError(err.response?.data?.message || "Failed to create store");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "32px auto", padding: 16 }}>
      <h2>Add New Store</h2>

      {message && <div style={{ color: "green", margin: "8px 0" }}>{message}</div>}
      {error && <div style={{ color: "red", margin: "8px 0" }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Store name"
          required
          style={{ padding: 10 }}
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Store email (optional)"
          style={{ padding: 10 }}
        />

        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          required
          rows={3}
          style={{ padding: 10 }}
        />

        <label>
          <div style={{ marginBottom: 6 }}>Select Store Owner</div>
          {loadingOwners ? (
            <div>Loading owners...</div>
          ) : owners.length === 0 ? (
            <div style={{ color: "orange" }}>
              No store owners found. Create a store owner first via Add User (role = STORE_OWNER).
            </div>
          ) : (
            <select
              name="owner_id"
              value={form.owner_id}
              onChange={handleChange}
              required
              style={{ padding: 10 }}
            >
              {owners.map(o => (
                <option key={o.id} value={o.id}>
                  {o.name} — {o.email}
                </option>
              ))}
            </select>
          )}
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={loadingOwners || owners.length === 0}
            style={{ padding: "10px 16px", cursor: "pointer" }}
          >
            Create Store
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/stores")}
            style={{ padding: "10px 16px", cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
