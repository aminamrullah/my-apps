import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import UserList from "./pages/UserList";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import LandingPage from "./pages/LandingPage";

const SidebarLayout = () => (
  <div className="flex min-h-screen bg-gray-100">
    <Sidebar />
    <div className="flex-1 ml-64">
      <Navbar />
      <main className="p-4 mt-4">
        <Outlet />
      </main>
    </div>
  </div>
);

const AuthLayout = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <Outlet />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
