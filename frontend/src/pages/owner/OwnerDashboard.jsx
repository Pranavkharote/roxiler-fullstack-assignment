import { useEffect, useState, useContext } from "react";
import api from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

function OwnerDashboard() {

  const { logout } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    api.get("/owner/dashboard")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log("owner dash err:", err);
        setMsg("Error loading dashboard");
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <p>Loading...</p>;

  if (!data || !data.store) {
    return (
      <div style={{ padding: 20 }}>
        <p>No store found for this owner.</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <button 
        onClick={logout}
        style={{ padding:"6px 12px", marginBottom:20 }}
      >
        Logout
      </button>

      <h2>Owner Dashboard</h2>

      <div style={{ marginTop: 10 }}>
        <b>Store:</b> {data.store.name}<br />
        <b>Address:</b> {data.store.address}<br />
        <b>Average Rating:</b> {data.avg_rating}
      </div>

      <h3 style={{ marginTop: 25 }}>Users who rated your store</h3>
      {data.ratings.length === 0 ? (
        <p>No ratings yet.</p>
      ) : (
        <table style={{ width:"100%", marginTop: 10, borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#eee" }}>
              <th style={th}>User Name</th>
              <th style={th}>Email</th>
              <th style={th}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.ratings.map((r, i) => (
              <tr key={i}>
                <td style={td}>{r.name}</td>
                <td style={td}>{r.email}</td>
                <td style={td}>{r.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}



export default OwnerDashboard;
