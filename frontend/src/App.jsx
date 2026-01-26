import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import NavbarDashboard from "./components/Navbar-dashboard";
import UserList from "./pages/UserList";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import LandingPage from "./pages/LandingPage";
import JamaahList from "./pages/JamaahList";
import AddJamaah from "./pages/AddJamaah";
import EditJamaah from "./pages/EditJamaah";
import PackageList from "./pages/PackageList";
import AddPackage from "./pages/AddPackage";
import EditPackage from "./pages/EditPackage";
import EmployeeList from "./pages/EmployeeList";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import BookingList from "./pages/BookingList";
import AddBooking from "./pages/AddBooking";
import EditBooking from "./pages/EditBooking";

const SidebarLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex flex-col min-h-screen md:pl-64">
        <NavbarDashboard onMenuToggle={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6 mt-4 sm:mt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

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
          <Route path="/jamaahs" element={<JamaahList />} />
          <Route path="/jamaahs/add" element={<AddJamaah />} />
          <Route path="/jamaahs/edit/:id" element={<EditJamaah />} />
          <Route path="/packages" element={<PackageList />} />
          <Route path="/packages/add" element={<AddPackage />} />
          <Route path="/packages/edit/:id" element={<EditPackage />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/add" element={<AddEmployee />} />
          <Route path="/employees/edit/:id" element={<EditEmployee />} />
          <Route path="/bookings" element={<BookingList />} />
          <Route path="/bookings/add" element={<AddBooking />} />
          <Route path="/bookings/edit/:id" element={<EditBooking />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
