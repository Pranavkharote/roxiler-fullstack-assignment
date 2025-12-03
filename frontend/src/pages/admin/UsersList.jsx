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

    const params = new URLSearchParams();

    if (filters.name) params.append("name", filters.name);
    if (filters.email) params.append("email", filters.email);
    if (filters.address) params.append("address", filters.address);
    if (filters.role) params.append("role", filters.role);

    params.append("sort", sort);
    params.append("order", order);

    api
      .get(`/admin/get-users?${params.toString()}`)
      .then((res) => {
        setUsers(res.data.users || []);
      })
      .catch((err) => {
        console.error("Error loading users:", err);
      })
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

  const toggleSort = (field) => {
    if (sort === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);
      setOrder("asc");
    }
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

  loadUsers(); // reload all users
};


  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
      <h2>Users List</h2>

      {/* Filters */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          marginTop: "20px",
          marginBottom: "15px",
        }}
      >
        <input
          name="name"
          placeholder="Filter by name"
          value={filters.name}
          onChange={handleFilterChange}
        />

        <input
          name="email"
          placeholder="Filter by email"
          value={filters.email}
          onChange={handleFilterChange}
        />

        <input
          name="address"
          placeholder="Filter by address"
          value={filters.address}
          onChange={handleFilterChange}
        />

        <select name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">All Roles</option>
          <option value="SYSTEM_ADMIN">System Admin</option>
          <option value="NORMAL_USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
      </div>

      <button
        onClick={handleSearch}
        style={{ marginBottom: "15px", padding: "8px 14px" }}
      >
        Apply Filters
      </button>
      <button
  onClick={resetFilters}
  style={{ marginBottom: "15px", padding: "8px 14px", background: "#555252ff" }}
>
  Reset Filters
</button>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found based on filters.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ background: "#464545ff" }}>
              <th style={th} onClick={() => toggleSort("name")}>
                Name {sort === "name" ? (order === "asc" ? "↑" : "↓") : ""}
              </th>

              <th style={th} onClick={() => toggleSort("email")}>
                Email {sort === "email" ? (order === "asc" ? "↑" : "↓") : ""}
              </th>

              <th style={th} onClick={() => toggleSort("address")}>
                Address {sort === "address" ? (order === "asc" ? "↑" : "↓") : ""}
              </th>

              <th style={th} onClick={() => toggleSort("role")}>
                Role {sort === "role" ? (order === "asc" ? "↑" : "↓") : ""}
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={td}>{u.name}</td>
                <td style={td}>{u.email}</td>
                <td style={td}>{u.address}</td>
                <td style={td}>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  padding: "10px",
  borderBottom: "2px solid #ccc",
  cursor: "pointer",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};
