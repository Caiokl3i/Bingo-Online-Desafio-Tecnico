import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import "./Register.css";

export default function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", { name, email, password });
      onRegister(); // voltar para login
    } catch (err) {
      console.log(err.message);
      setError(err.message || "Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Efeitos de fundo */}
      <div className="glow-effect glow-top-left"></div>
      <div className="glow-effect glow-bottom-right"></div>

      <div className="auth-glass-card">
        <header className="auth-header">
          <h1>Crie sua conta</h1>
          <p>Preencha os dados para começar a jogar.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">⚠️ {error}</div>}

          <div className="input-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Crie uma senha forte"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <span className="spinner"></span> : "Confirmar Cadastro"}
          </button>

          <div className="auth-footer">
            <span>Já tem conta? </span>
            <Link to="/" className="auth-link">
              Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}