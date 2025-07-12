import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from "../pages/login/Login.js";
import MainScreen from "../pages/MainScreen.js";

const AppRoutes = () => {
  const [isAuthenticated, setAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  const [accessType, setAccessType] = useState(
    localStorage.getItem("accessType")
  );
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.clear();
          setAuthenticated(false);
          setAccessType(null);
          navigate("/login");
        } else {
          setAccessType(decoded.accessType);
        }
      } catch (err) {
        console.error("Token error:", err);
        localStorage.clear();
        setAuthenticated(false);
        setAccessType(null);
        navigate("/login");
      }
    } else {
      setAuthenticated(false);
      setAccessType(null);
    }
  }, [navigate]);

  const handleLogin = () => {
    setAuthenticated(true);
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setAccessType(decoded.accessType);
    }
    navigate("/MainScreen");
  };

  const handleLogout = () => {
    localStorage.clear();
    setAuthenticated(false);
    setAccessType(null);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route
        path="/MainScreen"
        element={
          isAuthenticated ? (
            <MainScreen setAuthenticated={handleLogout} userRole={accessType} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
