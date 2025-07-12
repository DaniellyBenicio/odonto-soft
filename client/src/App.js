import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes/Routes";
import { jwtDecode } from "jwt-decode";

const App = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          setAuthenticated(true);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("accessType");
          localStorage.removeItem("username");
          setAuthenticated(false);
        }
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("accessType");
        localStorage.removeItem("username");
        setAuthenticated(false);
      }
    } else {
      setAuthenticated(false);
    }
  }, []);

  return (
    <Router>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        setAuthenticated={setAuthenticated}
      />
    </Router>
  );
};

export default App;
