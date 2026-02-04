import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./UserProfile.css";

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get("/profile/userProfile");
        setProfile(data);
      } catch (err) {
        console.error("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="loading-screen">
      <div className="tech-spinner"></div>
      <p>Carregando dados do jogador...</p>
    </div>
  );

  return (
    <div className="profile-layout">
      {/* Background Atmosférico */}
      <div className="bg-orb orb-profile-1"></div>
      <div className="bg-orb orb-profile-2"></div>

      <header className="profile-glass-header">
        <button className="back-btn-profile" onClick={() => navigate("/bingos")}>
          &larr; Voltar ao Lobby
        </button>
        <h1>DADOS DO JOGADOR</h1>
      </header>

      <div className="profile-content-grid">
        
        {/* COLUNA ESQUERDA: IDENTIDADE */}
        <aside className="identity-section">
          <div className="identity-card">
            <div className="avatar-wrapper">
              <div className="avatar-glow"></div>
              <div className="avatar-content">
                {profile?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
            
            <div className="identity-info">
              <h2 className="user-name">{profile?.name}</h2>
              <span className="user-email">{profile?.email}</span>
              <span className="user-role">
                {profile?.isAdmin ? "ADMINISTRADOR" : "JOGADOR REGISTRADO"}
              </span>
            </div>

            <div className="stats-mini-grid">
              <div className="stat-box">
                <span className="stat-value">{profile?.participating?.length || 0}</span>
                <span className="stat-label">ATIVOS</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{profile?.history?.length || 0}</span>
                <span className="stat-label">JOGADOS</span>
              </div>
            </div>
          </div>
        </aside>

        {/* COLUNA DIREITA: ATIVIDADE */}
        <main className="activity-section">
          
          {/* Jogos Ativos */}
          <section className="glass-panel mb-30">
            <div className="panel-header-profile">
              <h3>⚡ Salas em Andamento</h3>
            </div>
            
            {profile?.participating?.length > 0 ? (
              <div className="active-games-list">
                {profile.participating.map((game, index) => (
                  <div key={`${game.id}-${index}`} className="active-game-row">
                    <div className="game-row-info">
                      <span className="game-id-tag">SALA #{game.id}</span>
                      <span className="game-prize-txt">🏆 {game.prize}</span>
                    </div>
                    <button className="play-action-btn" onClick={() => navigate(`/game/${game.id}`)}>
                      RETORNAR &rarr;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-profile">
                <p>Nenhuma sala ativa no momento.</p>
                <button className="link-btn" onClick={() => navigate("/bingos")}>Procurar Salas</button>
              </div>
            )}
          </section>

          {/* Histórico */}
          <section className="glass-panel">
            <div className="panel-header-profile">
              <h3>📜 Histórico de Partidas</h3>
            </div>

            {profile?.history?.length > 0 ? (
              <div className="history-table-wrapper">
                <table className="tech-history-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Prêmio</th>
                      <th>Vencedor</th>
                      <th>Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.history.map((game, index) => (
                      <tr key={`${game.id}-${index}`}>
                        <td className="mono-text">#{game.id}</td>
                        <td>{game.prize}</td>
                        <td className="winner-cell">{game.winner || "---"}</td>
                        <td>
                          <span className={game.won ? "result-badge win" : "result-badge loss"}>
                            {game.won ? "VITÓRIA" : "DERROTA"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state-profile">
                <p>Nenhuma partida finalizada no histórico.</p>
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}