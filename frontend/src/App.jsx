// import React from "react";
// import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar";
// import UserList from "./pages/UserList";
// import AddUser from "./pages/AddUser";
// import EditUser from "./pages/EditUser";
// import Login from "./components/Login";
// import Register from "./components/Register";
// import Dashboard from "./components/Dashboard";
// import LandingPage from "./pages/LandingPage";

// const SidebarLayout = () => (
//   <div className="flex min-h-screen bg-gray-100">
//     <Sidebar />
//     <div className="flex-1 ml-64">
//       <Navbar />
//       <main className="p-4 mt-4">
//         <Outlet />
//       </main>
//     </div>
//   </div>
// );

// const AuthLayout = () => (
//   <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//     <Outlet />
//   </div>
// );

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route element={<AuthLayout />}>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//         </Route>
//         <Route element={<SidebarLayout />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/users" element={<UserList />} />
//           <Route path="/users/add" element={<AddUser />} />
//           <Route path="/users/edit/:id" element={<EditUser />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "https://my-apps-c9hu.vercel.app/";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "" });

  useEffect(() => {
    if (token) fetchBooks();
  }, [token]);

  const fetchBooks = async () => {
    const res = await axios.get(`${API}/books`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBooks(res.data);
  };

  const handleLogin = async () => {
    const res = await axios.post(`${API}/auth/login`, {
      username: "admina",
      password: "123",
    });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
  };

  const handleAddBook = async () => {
    await axios.post(`${API}/books`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBooks();
  };

  if (!token)
    return <button onClick={handleLogin}>Login (Demo: admin/password)</button>;

  return (
    <div>
      <h1>My Books</h1>
      <input
        placeholder="Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        placeholder="Author"
        onChange={(e) => setForm({ ...form, author: e.target.value })}
      />
      <button onClick={handleAddBook}>Add Book</button>
      <ul>
        {books.map((b) => (
          <li key={b.id}>
            {b.title} - {b.author}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
