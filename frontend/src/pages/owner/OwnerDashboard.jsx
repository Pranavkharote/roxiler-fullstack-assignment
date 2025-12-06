import React, { useEffect, useState, useContext } from "react";
import api from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function OwnerDashboard() {
  // const { logout } = useContext(AuthContext);/auth
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadData();
  }, []);

    const logout = () => {
    localStorage.clear();
    navigate("/")
    // setUser(null);
  };


  const loadData = () => {
    api
      .get("/owner/dashboard")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log("owner dash err:", err);
        setMsg("Error loading dashboard");
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <p className="p-4">Loading...</p>;

  if (!data || !data.store) {
    return (
      <div className="p-5">
        <p className="mb-3">No store found for this owner.</p>
        <button
          onClick={logout}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <button
        onClick={logout}
        className="px-4 py-2 bg-gray-800 text-white rounded mb-5"
      >
        Logout
      </button>

      <h2 className="text-xl font-semibold mb-3">Owner Dashboard</h2>

      {/* Store Details */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <p>
          <b>Store:</b> {data.store.name}
        </p>
        <p>
          <b>Address:</b> {data.store.address}
        </p>
        <p>
          <b>Average Rating:</b> {data.avg_rating}
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-2">
        Users who rated your store
      </h3>

      {data.ratings.length === 0 ? (
        <p>No ratings yet.</p>
      ) : (
        <table className="w-full border-collapse mt-2 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border-b font-medium text-left">User Name</th>
              <th className="p-2 border-b font-medium text-left">Email</th>
              <th className="p-2 border-b font-medium text-left">Rating</th>
            </tr>
          </thead>

          <tbody>
            {data.ratings.map((r, idx) => (
              <tr key={idx} className="odd:bg-gray-50">
                <td className="p-2 border-b">{r.user_name}</td>
                <td className="p-2 border-b">{r.user_email}</td>
                <td className="p-2 border-b">{r.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* optional message display */}
      {msg && <p className="mt-3 text-red-600">{msg}</p>}
    </div>
  );
}

export default OwnerDashboard;
