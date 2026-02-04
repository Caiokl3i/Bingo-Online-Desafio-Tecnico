import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { checkWin } from "../utils/bingoUtils";
import "./BingoGame.css";

export default function BingoGame() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bingo, setBingo] = useState(null);
  const [card, setCard] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.isAdmin);
      } catch (e) { console.error("Token inválido"); }
    }
    loadGameData();
    const syncInterval = setInterval(loadGameData, 5000);
    return () => clearInterval(syncInterval);
  }, [id]);

  const loadGameData = useCallback(async () => {
    try {
      const joinData = await api.post(`/bingos/${id}/join`);
      if (joinData.card) {
        setCard(joinData.card);
        const result = checkWin(joinData.card.numbers, joinData.card.markedNumbers);
        if (result.win) setHasWon(true);
      }

      const allBingos = await api.get("/bingos");
      const currentBingo = allBingos.find((b) => b.id === Number(id));
      setBingo(currentBingo);

      if (currentBingo?.status === "finished") {
        setIsAutoMode(false);
      }
    } catch (err) {
      console.error("Erro ao sincronizar dados");
    }
  }, [id]);

  const executeDraw = async () => {
    if (bingo?.status === "finished") return;

    try {
      const res = await api.post(`/bingos/${id}/draw`);
      if (res.message?.includes("Todos os números")) {
        setIsAutoMode(false);
        return;
      }
      loadGameData();
    } catch (err) {
      setIsAutoMode(false);
    }
  };

  useEffect(() => {
    if (isAutoMode && isAdmin && bingo?.status !== "finished") {
      setCountdown(3);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            executeDraw();
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setCountdown(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isAutoMode, isAdmin, bingo?.status]);

  const handleMarkNumber = async (num) => {
    if (bingo?.status === "finished") return;

    try {
      const updatedCard = await api.post(`/bingos/${id}/mark`, { number: num });
      setCard(updatedCard);

      const result = checkWin(updatedCard.numbers, updatedCard.markedNumbers);
      
      if (result.win && !hasWon) {
        setHasWon(true);
        const token = localStorage.getItem("token");
        let winnerName = "Jogador";
        if (token) {
            const decoded = jwtDecode(token);
            winnerName = decoded.name || "Jogador sem nome";
        }
        await api.patch(`/bingos/${id}/finish`, { winner: winnerName });
        alert(`🎉 BINGO! Você completou uma ${result.type}!`);
        loadGameData();
      }
    } catch (err) {
      console.error("Erro ao marcar número", err);
    }
  };

  // Última bola sorteada
  const lastNumber = bingo?.drawnNumbers?.length > 0 
    ? bingo.drawnNumbers[bingo.drawnNumbers.length - 1] 
    : "--";

  return (
    <div className={`game-container ${hasWon ? 'state-won' : ''}`}>
      {/* Background Atmosférico */}
      <div className="bg-orb orb-game-1"></div>
      <div className="bg-orb orb-game-2"></div>

      {/* Header do Jogo */}
      <header className="game-glass-header">
        <div className="header-left">
          <button className="back-link" onClick={() => navigate("/bingos")}>
            &larr; Sair
          </button>
          <div className="game-info-box">
            <span className="info-label">SALA</span>
            <span className="info-value">#{id}</span>
          </div>
        </div>

        <div className="header-center">
          <div className="prize-display">
            <span className="prize-icon">🏆</span>
            <span className="prize-text">{bingo?.prize}</span>
          </div>
        </div>

        <div className="header-right">
          <div className={`status-dot ${bingo?.status}`}></div>
          <span className="status-text">
            {bingo?.status === 'active' ? 'AO VIVO' : 
             bingo?.status === 'waiting' ? 'ESPERA' : 'FIM'}
          </span>
        </div>
      </header>

      {/* Layout Dividido: Painel Sorteio (Esq) vs Cartela (Dir) */}
      <div className="game-split-layout">
        
        {/* LADO ESQUERDO: CONTROLES E GLOBO */}
        <aside className="draw-panel">
          <div className="sphere-container">
            <div className={`draw-sphere ${isAutoMode ? 'pulsing' : ''}`}>
              <span className="sphere-number">{lastNumber}</span>
            </div>
            <div className="sphere-shadow"></div>
          </div>

          <div className="draw-status">
            {bingo?.status === "finished" ? (
              <span className="status-message finish">JOGO ENCERRADO</span>
            ) : isAutoMode ? (
              <span className="status-message auto">
                Sorteando em <span className="timer">{countdown}s</span>
              </span>
            ) : (
              <span className="status-message wait">Aguardando bola...</span>
            )}
          </div>

          {isAdmin && bingo?.status !== "finished" && (
            <div className="admin-actions-panel">
              <button 
                className={`control-btn ${isAutoMode ? 'stop' : 'auto'}`}
                onClick={() => setIsAutoMode(!isAutoMode)}
              >
                {isAutoMode ? "PAUSAR AUTO" : "INICIAR AUTO"}
              </button>
              
              {!isAutoMode && (
                <button className="control-btn draw" onClick={executeDraw}>
                  SORTEAR 1
                </button>
              )}
            </div>
          )}

          <div className="history-strip">
            <span className="history-label">ÚLTIMAS:</span>
            <div className="history-scroll">
              {bingo?.drawnNumbers?.slice(-5).reverse().map((n, i) => (
                <span key={i} className="mini-ball">{n}</span>
              ))}
            </div>
          </div>
        </aside>

        {/* LADO DIREITO: CARTELA */}
        <main className="card-panel">
          <div className="card-glass-frame">
            <div className="card-header-internal">
              <h3>BINGO CARD</h3>
              <span className="player-tag">VOCÊ</span>
            </div>

            <div className={`bingo-grid ${hasWon ? 'grid-won' : ''}`}>
              {card?.numbers?.flat().map((num, i) => {
                const isDrawn = bingo?.drawnNumbers?.includes(num);
                const isMarked = card?.markedNumbers?.includes(num);
                const isClickable = isDrawn && !isMarked && bingo?.status !== "finished";

                return (
                  <button
                    key={i}
                    className={`grid-cell ${isMarked ? 'marked' : ''} ${isDrawn && !isMarked ? 'highlight' : ''}`}
                    onClick={() => handleMarkNumber(num)}
                    disabled={!isClickable}
                  >
                    {num}
                    {isMarked && <span className="check-mark">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MENSAGEM DE VENCEDOR (OVERLAY) */}
          {bingo?.status === "finished" && (
            <div className="winner-overlay">
              <div className="winner-content">
                <span className="trophy-emoji">🏆</span>
                <h2>{hasWon ? "VOCÊ GANHOU!" : "JOGO FINALIZADO"}</h2>
                <div className="winner-details">
                  <span>Vencedor:</span>
                  <strong className="winner-name">{bingo?.winner || "---"}</strong>
                </div>
                <button className="exit-btn" onClick={() => navigate("/bingos")}>
                  Voltar ao Lobby
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}