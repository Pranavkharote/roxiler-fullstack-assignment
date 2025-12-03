import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_stores: 0,
    total_ratings: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }} className="bg-red-300">
      <h2>Admin Dashboard</h2>

      <div style={{ marginTop: "20px" }}>
        <p><b>Total Users:</b> {stats.total_users}</p>
        <p><b>Total Stores:</b> {stats.total_stores}</p>
        <p><b>Total Ratings:</b> {stats.total_ratings}</p>
      </div>
    </div>
  );
}
