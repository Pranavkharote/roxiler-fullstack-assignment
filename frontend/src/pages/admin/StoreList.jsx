import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function StoresList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stores")
      .then((res) => {
        setStores(res.data.stores || []);
      })
      .catch((err) => {
        console.error("Error loading stores:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h2>Stores List</h2>

      {stores.length === 0 ? (
        <p style={{ marginTop: "16px" }}>No stores found. Add one first.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ background: "#464646ff" }}>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Address</th>
              <th style={th}>Owner</th>
              <th style={th}>Average Rating</th>
            </tr>
          </thead>

          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td style={td}>{store.name}</td>
                <td style={td}>{store.email || "—"}</td>
                <td style={td}>{store.address}</td>
                <td style={td}>{store.owner_name}</td>
                <td style={td}>{Number(store.avg_rating).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "2px solid #ccc",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};
