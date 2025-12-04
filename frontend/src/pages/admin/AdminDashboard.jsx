import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import UsersList from "./UsersList";
import StoresList from "./StoreList";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_users: 0,
    total_stores: 0,
    total_ratings: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then((res) => {
        if (res?.data) setStats(res.data);
      })
      .catch((err) => {
        console.log("dashboard load error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const goTo = (path) => navigate(path);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">

      
      <div className="mb-6 bg-white shadow-sm p-4 rounded-md flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    
      </div>

    
      <div className="bg-white shadow-md rounded-md p-5 mb-6">

        <h2 className="text-lg font-semibold mb-4">Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="p-4 border rounded-md bg-gray-50">
            <div className="text-sm font-medium text-gray-500">Total Users</div>
            <div className="text-xl font-bold">{stats.total_users}</div>
          </div>

          <div className="p-4 border rounded-md bg-gray-50">
            <div className="text-sm font-medium text-gray-500">Total Stores</div>
            <div className="text-xl font-bold">{stats.total_stores}</div>
          </div>

          <div className="p-4 border rounded-md bg-gray-50">
            <div className="text-sm font-medium text-gray-500">Total Ratings</div>
            <div className="text-xl font-bold">{stats.total_ratings}</div>
          </div>
        </div>

      
        <div className="flex gap-3 flex-wrap mt-5">
          <button
            onClick={() => goTo("/admin/add-user")}
            className="px-4 py-2 text-sm bg-gray-800 text-white rounded border border-black"
          >
            Add User
          </button>
          {/* <button
            onClick={() => goTo("/admin/add-user")}
            
          >
            Add User
          </button> */}

          <button
            onClick={() => goTo("/admin/add-store")}
            className="px-4 py-2 text-sm bg-gray-800 text-white rounded border border-black"
          >
            Add Store
          </button>

          <button
            onClick={() => goTo("/admin/users")}
            className="px-4 py-2 text-sm bg-gray-800 text-white rounded border border-black"
          >
            View Users
          </button>

          <button
            onClick={() => goTo("/admin/stores")}
            className="px-4 py-2 text-sm bg-gray-800 text-white rounded border border-black"
          >
            View Stores
          </button>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Users</h3>
          <UsersList />
        </div>

        
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Stores</h3>
          <StoresList />
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;
