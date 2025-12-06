import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

function StoreList() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingInput, setRatingInput] = useState({});
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = () => {
    setLoading(true);
    api
      .get("/user/stores")
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

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleRate = (store_id) => {
    const ratingVal = ratingInput[store_id];

    if (!ratingVal || ratingVal < 1 || ratingVal > 5) {
      setMsg("Enter rating between 1 and 5");
      return;
    }

    api
      .post("/user/rate-store", {
        store_id,
        rating: Number(ratingVal),
      })
      .then((resp) => {
        setMsg(resp.data.msg || "Rating updated");
        loadStores();
      })
      .catch((err) => {
        console.log("rating err", err);
        setMsg("Something went wrong");
      });
  };

  const filteredStores = stores.filter((st) => {
    const term = search.toLowerCase();
    return (
      st.name.toLowerCase().includes(term) ||
      st.address.toLowerCase().includes(term) ||
      st.email?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return <p className="p-6 text-gray-600">Loading stores...</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">All Stores</h2>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {msg && <p className="text-green-600 mb-3">{msg}</p>}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name, address, email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {filteredStores.length === 0 ? (
        <p className="text-gray-600">No stores found</p>
      ) : (
        <div className="space-y-4">
          {filteredStores.map((st) => (
            <div
              key={st.id}
              className="border border-gray-300 p-4 rounded shadow-sm hover:shadow-md transition"
            >
              <div className="font-bold text-lg">{st.name}</div>

              <div className="text-gray-700">Address: {st.address}</div>
              {st.email && (
                <div className="text-gray-700">Email: {st.email}</div>
              )}

              <div className="mt-1 text-gray-800">
                Avg Rating:{" "}
                <span className="font-semibold">
                  {Number(st.avg_rating).toFixed(1)}
                </span>
              </div>

              <div>Your Rating: {st.user_rating || "N/A"}</div>

              <div className="mt-3 flex items-center">
            <div className="flex items-center gap-1">
  {[1, 2, 3, 4, 5].map((star) => (
    <button
      key={star}
      type="button"
      onClick={() =>
        setRatingInput({
          ...ratingInput,
          [st.id]: star,
        })
      }
      className="focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`w-6 h-6 transition ${
          star <= (ratingInput[st.id] || 0)
            ? "fill-yellow-400"
            : "fill-gray-300"
        }`}
      >
        <path d="M12 17.3l6.18 3.7-1.64-7.03L21.5 9.24l-7.19-.61L12 2 9.69 8.63 2.5 9.24l4.96 4.73L5.82 21z" />
      </svg>
    </button>
  ))}
</div>

                <button
                  onClick={() => handleRate(st.id)}
                  className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  {st.user_rating ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StoreList;

