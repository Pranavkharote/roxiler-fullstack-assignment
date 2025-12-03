import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
// i kept UsersList here, but you can remove if needed
import UsersList from "./UsersList";
import StoresList from "./StoreList";

function AdminDashboard () {
  const navigate = useNavigate();

  // dashboard Stats
  const [stats, setStats] = useState({
    total_users: 0,
    total_stores: 0,
    total_ratings: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then((r) => {
        if (r?.data) {
          setStats(r.data);
        }
      })
      .catch((e) => {
        console.log("err loading dashboard", e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const goTo = (path) => {
    navigate(path);
  };

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: 15 }}>Admin Dashboard</h2>

      <div style={{ marginBottom: 25 }}>
        <div><b>Total Users:</b> {stats.total_users}</div>
        <div><b>Total Stores:</b> {stats.total_stores}</div>
        <div><b>Total Ratings:</b> {stats.total_ratings}</div>
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap:"wrap", marginBottom: "25px" }}>
        <button onClick={() => goTo("/admin/add-user")} style={btnStyle}>
          Add User
        </button>

        <button onClick={() => goTo("/admin/add-store")} style={btnStyle}>
          Add Store
        </button>

        <button onClick={() => goTo("/admin/users")} style={btnStyle}>
          View Users
        </button>

        <button onClick={() => goTo("/admin/stores")} style={btnStyle}>
          View Stores
        </button>
      </div>

     
      <UsersList />
      <StoresList/>
    </div>
  );
}

const btnStyle = {
  padding: "8px 14px",
  border: "1px solid #444",
  background: "#efefef",
  cursor: "pointer"
};

export default AdminDashboard;
