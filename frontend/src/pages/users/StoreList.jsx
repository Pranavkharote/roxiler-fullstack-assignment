import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

function StoreList() {

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingInput, setRatingInput] = useState({}); 
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = () => {
    setLoading(true);
    api.get("/user/stores")
      .then((res) => {
        if (res?.data?.stores) {
          setStores(res.data.stores);
        }
      })
      .catch((err) => {
        console.log("err fetching stores", err);
      })
      .finally(() => setLoading(false));
  };

  const handleRate = (store_id) => {
    const ratingVal = ratingInput[store_id];
    if (!ratingVal || ratingVal < 1 || ratingVal > 5) {
      setMsg("Enter rating between 1 and 5");
      return;
    }

    api.post("/user/rate-store", {
      store_id,
      rating: Number(ratingVal)
    })
      .then((resp) => {
        setMsg("Rating submitted");
        loadStores();  // refresh store list to update rating
      })
      .catch((err) => {
        console.log("rating err", err);
        setMsg("Error saving rating");
      });
  };

  if (loading) {
    return <p>Loading stores...</p>
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>All Stores</h2>

      {msg && (
        <p style={{ color: "green" }}>{msg}</p>
      )}

      {stores.length === 0 ? (
        <p>No stores found</p>
      ) : (
        <div style={{ marginTop: 15 }}>
          {stores.map((st) => (
            <div key={st.id} style={box}>
              <div style={{ marginBottom: 6 }}>
                <b>{st.name}</b>
              </div>

              <div>Address: {st.address}</div>
              <div>Avg Rating: {Number(st.avg_rating).toFixed(1)}</div>

              <div>
                Your Rating: {st.user_rating ? st.user_rating : "N/A"}
              </div>

              {/* rating input */}
              <div style={{ marginTop: 8 }}>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={ratingInput[st.id] || ""}
                  onChange={(e) =>
                    setRatingInput({
                      ...ratingInput,
                      [st.id]: e.target.value
                    })
                  }
                  placeholder="Rate 1-5"
                  style={{ width: 70 }}
                />

                <button
                  onClick={() => handleRate(st.id)}
                  style={{ marginLeft: 8, padding: "4px 8px" }}
                >
                  Submit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const box = {
  border: "1px solid #ddd",
  padding: "12px",
  borderRadius: "6px",
  marginBottom: "12px"
};

export default StoreList;
