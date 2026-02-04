import { getUserHistory } from "../models/cardModel.js";

export function profile(req, res) {
  res.json({
    message: 'Rota protegida',
    user: req.user
  });
}

export async function myProfileData(req, res) {
  try {
    const historyData = await getUserHistory(req.user.id);

    // Separar em duas listas: Jogando agora vs. Já acabou
    const participating = historyData.filter(game => game.status !== 'finished');
    const history = historyData.filter(game => game.status === 'finished');

    // Adiciona a propriedade 'won' (se o nome do vencedor for igual ao do usuário)
    const historyWithResult = history.map(game => ({
      ...game,
      won: game.winner === req.user.name
    }));

    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      participating,       // Bingos em andamento
      history: historyWithResult // Bingos finalizados
    });
  } catch (error) {
    console.error("Erro no perfil:", error);
    res.status(500).json({ message: "Erro ao buscar perfil" });
  }
}