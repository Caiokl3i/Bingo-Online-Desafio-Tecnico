import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, token, adminOnly = false }) {
  if (!token) return <Navigate to="/" />;

  try {
    const decoded = jwtDecode(token);
    
    // Agora verificamos a propriedade que você definiu no controller
    const isUserAdmin = decoded.isAdmin; 

    if (adminOnly && !isUserAdmin) {
      alert("Acesso negado: Somente administradores.");
      return <Navigate to="/bingos" />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/" />;
  }
}