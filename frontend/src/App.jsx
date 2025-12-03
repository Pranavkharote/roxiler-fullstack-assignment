import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
// import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AddUser from "./pages/admin/addUsers";
import AddStore from "./pages/admin/AddStore";
import UsersList from "./pages/admin/UsersList";
import StoreList from "./pages/admin/StoreList";
// import StoreList from "./pages/user/StoreList";

// import UserDashboard from "./pages/user/UserDashboard";
import StoreListByUser from "./pages/users/StoreList";

// import OwnerDashboard from "./pages/owner/OwnerDashboard";
// import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        {/* Public
        <Route path="/register" element={<Register />} />

      */} 
         <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
        <Route path="/admin/add-user" element={<AddUser />} />
          
         <Route path="/admin/add-store" element={<AddStore />} />
        <Route path="/admin/stores" element={<StoreList />} />
        <Route path="/admin/users" element={<UsersList />} />
        <Route path="/user/stores" element={<StoreListByUser />} />
        {/*

   
        <Route path="/user/dashboard" element={<UserDashboard />} />

        <Route path="/owner/dashboard" element={<OwnerDashboard />} />

     
        <Route path="*" element={<NotFound />} /> */}

      </Routes>
    </BrowserRouter>
  );
}
