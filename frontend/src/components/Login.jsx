import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import "./Login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      onLogin(res.token);
    } catch (err) {
      setError("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Efeitos de fundo (Glows) */}
      <div className="glow-effect glow-top-left"></div>
      <div className="glow-effect glow-bottom-right"></div>

      <div className="auth-glass-card">
        <header className="auth-header">
          <h1>Bem-vindo</h1>
          <p>Insira suas credenciais para entrar no jogo.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">⚠️ {error}</div>}

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <span className="spinner"></span> : "Entrar na Plataforma"}
          </button>

          <div className="auth-footer">
            <span>Não tem conta? </span>
            <Link to="/register" className="auth-link">
              Cadastre-se agora
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}