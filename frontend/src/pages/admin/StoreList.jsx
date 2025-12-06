import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function StoresList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    owner: "",
  });

  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");

  const loadStores = () => {
    setLoading(true);

    const params = new URLSearchParams({
      sort,
      order,
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim() !== "") params.append(key, value.trim());
    });

    api
      .get(`/admin/stores?${params.toString()}`)
      .then((res) => setStores(res.data.stores || []))
      .catch((err) => console.error("Failed to load stores:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, order]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetFilters = () => {
    setFilters({ name: "", email: "", address: "", owner: "" });
    setSort("name");
    setOrder("asc");
    loadStores();
  };

  const toggleSort = (field) => {
    setSort(field);
    setOrder((prev) => (field === sort ? (prev === "asc" ? "desc" : "asc") : "asc"));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h2 className="text-2xl font-semibold mb-4">Stores List</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <input
          name="name"
          placeholder="Store name"
          value={filters.name}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />

        <input
          name="email"
          placeholder="Email"
          value={filters.email}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />

        <input
          name="address"
          placeholder="Address"
          value={filters.address}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />

        <input
          name="owner"
          placeholder="Owner"
          value={filters.owner}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={loadStores}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>

        <button
          onClick={resetFilters}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-700 text-white">
                <SortableHeader field="name" sort={sort} order={order} toggleSort={toggleSort}>
                  Name
                </SortableHeader>

                <SortableHeader field="email" sort={sort} order={order} toggleSort={toggleSort}>
                  Email
                </SortableHeader>

                <SortableHeader field="address" sort={sort} order={order} toggleSort={toggleSort}>
                  Address
                </SortableHeader>

                <SortableHeader field="owner" sort={sort} order={order} toggleSort={toggleSort}>
                  Owner
                </SortableHeader>

                <SortableHeader field="avg_rating" sort={sort} order={order} toggleSort={toggleSort}>
                  Avg Rating
                </SortableHeader>
              </tr>
            </thead>

            <tbody>
              {stores.map((store) => (
                <tr key={store.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{store.name}</td>
                  <td className="p-3">{store.email || "—"}</td>
                  <td className="p-3">{store.address}</td>
                  <td className="p-3">{store.owner_name}</td>
                  <td className="p-3">{Number(store.avg_rating).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SortableHeader({ field, sort, order, toggleSort, children }) {
  return (
    <th
      className="p-3 cursor-pointer select-none text-left"
      onClick={() => toggleSort(field)}
    >
      {children} {sort === field ? (order === "asc" ? "↑" : "↓") : ""}
    </th>
  );
}
