import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [bingos, setBingos] = useState([]);
  const [tab, setTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      const [usersRes, bingosRes] = await Promise.all([
        api.get("/auth/users"), 
        api.get("/bingos")
      ]);

      setUsers(usersRes || []);
      setBingos(bingosRes || []);
      
    } catch (err) {
      console.error("Erro Admin:", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert("Acesso negado: Credenciais insuficientes.");
        navigate("/bingos");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFinishBingo = async (id) => {
    const confirm = window.confirm("⚠️ AÇÃO IRREVERSÍVEL\n\nDeseja forçar o encerramento deste bingo?");
    if (!confirm) return;

    try {
      await api.patch(`/bingos/${id}/finish`, { winner: "Encerrado pelo Admin" }); 
      fetchAdminData(); 
    } catch (err) {
      alert("Erro ao encerrar bingo.");
    }
  };

  return (
    <div className="admin-layout">
      {/* Background Tech */}
      <div className="bg-orb orb-admin-1"></div>
      <div className="bg-orb orb-admin-2"></div>

      <header className="admin-glass-header">
        <div className="header-left">
          <button className="back-link" onClick={() => navigate("/bingos")}>
            &larr; Voltar ao Jogo
          </button>
          <div className="admin-title">
            <h1>CENTRO DE COMANDO</h1>
            <span className="admin-badge">ADMINISTRATOR_MODE</span>
          </div>
        </div>
      </header>
      
      <main className="admin-content">
        {/* Navegação por Abas */}
        <div className="tabs-container">
          <button 
            className={`tab-btn ${tab === "users" ? "active" : ""}`} 
            onClick={() => setTab("users")}
          >
            👥 Usuários ({users.length})
          </button>
          <button 
            className={`tab-btn ${tab === "bingos" ? "active" : ""}`} 
            onClick={() => setTab("bingos")}
          >
            🎲 Gerenciar Bingos ({bingos.length})
          </button>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="tech-spinner"></div>
            <p>Sincronizando dados do sistema...</p>
          </div>
        ) : (
          <div className="panel-transition">
            
            {/* --- ABA DE USUÁRIOS --- */}
            {tab === "users" && (
              <section className="glass-panel">
                <div className="panel-header">
                  <h2>Base de Usuários</h2>
                  <p>Visão geral de todos os cadastros</p>
                </div>
                
                <div className="table-responsive">
                  <table className="tech-table">
                    <thead>
                      <tr>
                        <th>ID / Nome</th>
                        <th>Email de Acesso</th>
                        <th>Permissão</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-cell">
                              <div className="avatar-mini">{user.name.charAt(0)}</div>
                              <strong>{user.name}</strong>
                            </div>
                          </td>
                          <td className="email-cell">{user.email}</td>
                          <td>
                            <span className={user.isAdmin ? "role-badge admin" : "role-badge player"}>
                              {user.isAdmin ? "ADMIN" : "JOGADOR"}
                            </span>
                          </td>
                          <td><span className="status-dot online"></span> Ativo</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* --- ABA DE BINGOS --- */}
            {tab === "bingos" && (
              <section className="glass-panel transparent">
                <div className="panel-header">
                  <h2>Status dos Servidores de Jogo</h2>
                  <button className="refresh-btn" onClick={fetchAdminData}>↻ Atualizar</button>
                </div>

                <div className="admin-grid">
                  {bingos.map(bingo => (
                    <div key={bingo.id} className={`admin-card ${bingo.status}`}>
                      <div className="card-header-admin">
                        <span className="bingo-code">SERVER_{bingo.id.toString().padStart(3, '0')}</span>
                        <span className={`status-text status-${bingo.status}`}>
                          {bingo.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="card-stats">
                        <div className="stat-item">
                          <label>Prêmio</label>
                          <span>{bingo.prize}</span>
                        </div>
                        <div className="stat-item">
                          <label>Bolas</label>
                          <span>{bingo.drawnNumbers?.length || 0} / 75</span>
                        </div>
                      </div>

                      <div className="card-footer-admin">
                        {bingo.status === "finished" ? (
                          <div className="winner-display">
                            <span className="trophy">🏆</span> 
                            {bingo.winner || "Sem vencedor"}
                          </div>
                        ) : (
                          <div className="live-actions">
                            <button className="btn-enter" onClick={() => navigate(`/bingos/${bingo.id}`)}>
                              Monitorar
                            </button>
                            <button 
                              className="btn-terminate"
                              onClick={() => handleFinishBingo(bingo.id)}
                            >
                              FORÇAR FIM
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}