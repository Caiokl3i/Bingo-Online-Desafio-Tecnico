import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import "./Bingos.css";

export default function Bingos({ onLogout }) {
  const [bingos, setBingos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.isAdmin);
      } catch (err) {
        console.error("Erro ao ler permissões");
      }
    }
    loadBingos();
  }, []);

  const loadBingos = async () => {
    try {
      setLoading(true);
      const data = await api.get("/bingos");
      setBingos(data);
    } catch (err) {
      setError("Erro ao carregar bingos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja EXCLUIR permanentemente este bingo?")) {
      try {
        await api.delete(`/bingos/${id}`);
        setBingos(bingos.filter((bingo) => bingo.id !== id));
      } catch (err) {
        alert("Erro ao apagar bingo");
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Luzes de Fundo (Atmosfera) */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      {/* Barra de Navegação Flutuante */}
      <header className="glass-navbar">
        {/* LOGO BINGO LIVE */}
        <div className="nav-brand-live">
            <span className="brand-icon-live">🎲</span>
            <span className="brand-text-live">BINGO<span className="accent">LIVE</span></span>
        </div>

        <nav className="nav-right">
          {isAdmin && (
            <div className="admin-group">
              <button className="nav-btn" onClick={() => navigate("/admin")}>
                💼 Painel do Admin
              </button>
              <button className="nav-btn primary" onClick={() => navigate("/bingos/create")}>
                + CRIAR NOVO BINGO
              </button>
            </div>
          )}
          
          <div className="user-group">
            <button className="nav-btn profile" onClick={() => navigate("/profile")}>
              👤 Meu Perfil
            </button>
            <button className="nav-btn logout" onClick={onLogout}>
              Sair
            </button>
          </div>
        </nav>
      </header>

      {/* Área Principal */}
      <main className="dashboard-content">
        <div className="section-header">
          <div>
            <h2>Salas Disponíveis</h2>
            <p className="subtitle">Escolha uma partida e boa sorte!</p>
          </div>
          <span className="live-indicator">
            <span className="blink-dot"></span> Servidor Online
          </span>
        </div>

        {loading && <div className="loader-container"><div className="tech-spinner"></div><p>Carregando salas...</p></div>}
        {error && <div className="system-message error">{error}</div>}

        {!loading && bingos.length === 0 && (
          <div className="system-message info">
            <div className="empty-icon">📭</div>
            <h3>Nenhuma sala aberta</h3>
            <p>Aguarde o administrador iniciar um novo bingo.</p>
          </div>
        )}

        <div className="modules-grid">
          {bingos.map((bingo) => (
            <div
              className={`module-card ${bingo.status}`}
              key={bingo.id}
              onClick={() => navigate(`/bingos/${bingo.id}`)}
            >
              {/* Cabeçalho do Card */}
              <div className="module-header">
                <span className="module-id">SALA #{bingo.id}</span>
                <span className={`status-pill pill-${bingo.status}`}>
                  {bingo.status === 'active' ? '● EM ANDAMENTO' : 
                   bingo.status === 'waiting' ? '⏳ AGUARDANDO' : '🏁 ENCERRADO'}
                </span>
              </div>

              {/* Corpo do Card (Prêmio) */}
              <div className="module-body">
                <span className="label">Prêmio da Rodada</span>
                <h3 className="value highlight">🏆 {bingo.prize}</h3>
              </div>

              {/* Rodapé com Ação Clara */}
              <div className="module-footer">
                <button className="action-btn">
                  {bingo.status === 'finished' ? 'VER RESULTADO' : 'ENTRAR NA SALA →'}
                </button>
                
                {isAdmin && (
                  <button 
                    className="delete-link"
                    onClick={(e) => handleDelete(e, bingo.id)}
                    title="Excluir Bingo"
                  >
                    Excluir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}