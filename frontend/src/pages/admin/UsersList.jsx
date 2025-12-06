import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });

  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    setLoading(true);

    const params = new URLSearchParams({
      sort,
      order,
      ...(filters.name && { name: filters.name }),
      ...(filters.email && { email: filters.email }),
      ...(filters.address && { address: filters.address }),
      ...(filters.role && { role: filters.role }),
    });

    api
      .get(`/admin/get-users?${params.toString()}`)
      .then((res) => setUsers(res.data.users || []))
      .catch((err) => console.error("Error loading users:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [sort, order]);

  useEffect(() => {
    loadUsers();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    loadUsers();
  };

  const resetFilters = () => {
    setFilters({
      name: "",
      email: "",
      address: "",
      role: "",
    });
    setSort("name");
    setOrder("asc");
    loadUsers();
  };

  const toggleSort = (field) => {
    if (sort === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);
      setOrder("asc");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Users List</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input
          name="name"
          placeholder="Name"
          value={filters.name}
          onChange={handleFilterChange}
          className="border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="email"
          placeholder="Email"
          value={filters.email}
          onChange={handleFilterChange}
          className="border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="address"
          placeholder="Address"
          value={filters.address}
          onChange={handleFilterChange}
          className="border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
        />

        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          className="border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Roles</option>
          <option value="SYSTEM_ADMIN">System Admin</option>
          <option value="NORMAL_USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleSearch}
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
        <p className="text-gray-600">Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th
                  className="py-2 px-3 cursor-pointer"
                  onClick={() => toggleSort("name")}
                >
                  Name {sort === "name" && (order === "asc" ? "↑" : "↓")}
                </th>

                <th
                  className="py-2 px-3 cursor-pointer"
                  onClick={() => toggleSort("email")}
                >
                  Email {sort === "email" && (order === "asc" ? "↑" : "↓")}
                </th>

                <th
                  className="py-2 px-3 cursor-pointer"
                  onClick={() => toggleSort("address")}
                >
                  Address {sort === "address" && (order === "asc" ? "↑" : "↓")}
                </th>

                <th
                  className="py-2 px-3 cursor-pointer"
                  onClick={() => toggleSort("role")}
                >
                  Role {sort === "role" && (order === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-100">
                  <td className="py-2 px-3">{u.name}</td>
                  <td className="py-2 px-3">{u.email}</td>
                  <td className="py-2 px-3">{u.address}</td>
                  <td className="py-2 px-3">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
