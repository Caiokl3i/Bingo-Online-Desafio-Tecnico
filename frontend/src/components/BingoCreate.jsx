import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./BingoCreate.css";

export default function BingoCreate() {
  const [prize, setPrize] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/bingos/create", { prize });
      navigate("/bingos"); // volta para lista
    } catch (err) {
      setError("Erro ao criar bingo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-layout">
      {/* Background Atmosférico */}
      <div className="bg-orb orb-create-1"></div>
      <div className="bg-orb orb-create-2"></div>

      <div className="create-glass-card">
        <header className="create-header">
          <div className="icon-wrapper">🛠️</div>
          <h1>Configurar Nova Sala</h1>
          <p>Defina o prêmio principal para iniciar a partida.</p>
        </header>

        <form className="create-form" onSubmit={handleSubmit}>
          {error && <div className="create-error">⚠️ {error}</div>}

          <div className="input-group">
            <label htmlFor="prize">Prêmio da Rodada</label>
            <input
              id="prize"
              type="text"
              placeholder="Ex: R$ 50,00 ou Um Carro Zero"
              value={prize}
              onChange={(e) => setPrize(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/bingos")}
              disabled={loading}
            >
              Cancelar
            </button>
            
            <button 
              type="submit" 
              className="btn-submit" 
              disabled={loading}
            >
              {loading ? <span className="spinner-mini"></span> : "Lançar Sala 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}