import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// Ajuste o import abaixo para Maiúsculo conforme o erro anterior
import ProtectedRoute from "./components/protectedRoute";
import BingosPage from "./pages/BingosPage";
import BingoCreatePage from "./pages/BingoCreatePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import BingoGamePage from "./pages/BingoGamePage";
import UserProfilePage from "./pages/UserProfilePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  return (
    // Removido o <BrowserRouter> daqui, pois agora ele está no main.jsx
    <Routes>
      {/* Login */}
      <Route
        path="/"
        element={
          token ? <Navigate to="/bingos" /> : <LoginPage onLogin={setToken} />
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          token ? (
            <Navigate to="/bingos" />
          ) : (
            <RegisterPage onRegister={() => navigate("/")} />
          )
        }
      />

      {/* Rota de Lista de Bingos (Qualquer um logado vê) */}
      <Route
        path="/bingos"
        element={
          <ProtectedRoute token={token}>
            <BingosPage onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      {/* Rota de Admin (Só admin vê) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute token={token} adminOnly={true}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Rota de Criar Bingo (Só admin vê) */}
      <Route
        path="/bingos/create"
        element={
          <ProtectedRoute token={token} adminOnly={true}>
            <BingoCreatePage />
          </ProtectedRoute>
        }
      />

      {/* Tela do Jogo */}
      <Route
        path="/bingos/:id"
        element={
          <ProtectedRoute token={token}>
            <BingoGamePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute token={token}>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute token={token}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}