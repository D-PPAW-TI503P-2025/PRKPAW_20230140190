
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PresensiPage from './components/Presensipage';
import ReportPage from './components/ReportPage';


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
};


const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  try {
    const user = jwtDecode(token);
    if (user.role !== 'admin') return <Navigate to="/" />;
  } catch (e) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/presensi"
              element={
                <ProtectedRoute>
                  <PresensiPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <AdminRoute>
                  <ReportPage />
                </AdminRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center text-gray-700">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="mt-2">Silakan buka menu Presensi untuk melakukan absensi.</p>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;