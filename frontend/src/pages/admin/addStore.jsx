import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

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
    console.log(form)

    // basic client-side validation
    if (!form.name.trim() || !form.address.trim() || !form.owner_id) {
      setError("Name, address and owner are required.");
      return;
    }

    try {
      const res = await api.post("/admin/add-store", form);
      setMessage(res.data?.message || "Store created successfully");
      // redirect to stores list after short delay
      toast.success(res.data.message);
      setTimeout(() => navigate("/admin/stores"), 900);
    } catch (err) {
      console.error("Add store failed:", err);
      setError(err.response?.data?.message || "Failed to create store");
      toast.error(error)
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "32px auto", padding: 16 }}>
      <h2 className="text-lg font-bold">Add New Store</h2>

      <form onSubmit={handleSubmit} className="grid gap-2">
      <label for="name" className="mt-3">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Store name"
          required
           className="w-full border p-2 rounded "
        />
<label for="email" className="mt-3">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Store email "
          className="w-full border p-2 rounded"
        />
<label for="address" className="mt-3">Address</label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          required
          rows={3}
          className="w-full border p-2 rounded"
        />

        <label>
          <div >Select Store Owner</div>
          {loadingOwners ? (
            <div>Loading owners...</div>
          ) : owners.length === 0 ? (
            <div className="text-orange-400" >
              No store owners found. Create a store owner first via Add User (role = STORE_OWNER).
            </div>
          ) : (
            <select
              name="owner_id"
              value={form.owner_id}
              onChange={handleChange}
              required
              className="p-3 bg-gray-300"
            >
              {owners.map(o => (
                <option key={o.id} value={o.id}>
                  {o.name} — {o.email}
                </option>
              ))}
            </select>
          )}
        </label>

        <div className="flex gap-8">
          <button
            type="submit"
            // disabled={loadingOwners || owners.length === 0}
           className="w-full border p-2 rounded mt-4 bg-blue-500"
          >
            Create Store
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/stores")}
            className="p-3 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    <ToastContainer/>
    </div>
  );
}
