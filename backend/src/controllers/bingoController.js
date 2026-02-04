import { createBingoModel, findById, updateDrawnNumbers, setWinner, deleteBingo, getAllBingos } from "../models/bingoModel.js";
import { createCard, findByUserAndBingo, updateMarkedNumbers } from "../models/cardModel.js";

export const createBingo = async (req, res) => {
    const { prize } = req.body;
    await createBingoModel({ prize });
    res.status(201).json({ message: "Bingo criado com sucesso" });
};

export async function joinBingo(req, res) {
    const bingoId = Number(req.params.id);
    const userId = req.user.id;

    const bingo = await findById(bingoId);
    if (!bingo) return res.status(404).json({ message: "Bingo não encontrado" });

    // Verifica se o usuário já tem uma cartela para não criar outra
    let card = await findByUserAndBingo(bingoId, userId);

    if (!card) {
        card = await createCard({ bingoId, userId, numbers: generateCard() });
    }

    // RETORNE A CARTELA AQUI!
    res.json({ message: "Sucesso", card });
}

export async function drawNumber(req, res) {
    const bingoId = Number(req.params.id);
    const bingo = await findById(bingoId);
    if (!bingo) return res.status(404).json({ message: "Bingo não encontrado" });
    if (bingo.status === "finished") return res.status(400).json({ message: "Bingo encerrado" });

    const available = Array.from({ length: 75 }, (_, i) => i + 1).filter(n => !bingo.drawnNumbers.includes(n));
    if (available.length === 0) return res.json({ message: "Todos os números já foram sorteados" });

    const drawn = available[Math.floor(Math.random() * available.length)];
    await updateDrawnNumbers(bingoId, [...bingo.drawnNumbers, drawn]);
    res.json({ number: drawn });
}

export async function markNumber(req, res) {
    const bingoId = Number(req.params.id);
    const { number } = req.body;
    const userId = req.user.id;

    const card = await findByUserAndBingo(bingoId, userId);
    if (!card) return res.status(404).json({ message: "Cartela não encontrada" });

    if (!card.markedNumbers.includes(number)) {
        card.markedNumbers.push(number);
        await updateMarkedNumbers(card.id, card.markedNumbers);
    }

    res.json(card);
}

export async function deleteBingoController(req, res) {
    const { id } = req.params;
    await deleteBingo(id);
    res.json({ message: "Bingo deletado com sucesso" });
}

export async function getBingos(req, res) {
    const bingos = await getAllBingos();
    res.json(bingos);
}

function generateCard() {
    const numbers = Array.from({ length: 75 }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    const selected = numbers.slice(0, 25);
    const matrix = [];
    while (selected.length) matrix.push(selected.splice(0, 5));
    return matrix;
}

export async function finishBingo(req, res) {
  const { id } = req.params;
  const { winner } = req.body; // O front envia { winner: "Nome" }

  try {
    // Validação básica
    if (!winner) {
        return res.status(400).json({ message: "Nome do vencedor é obrigatório" });
    }

    // Chama o Model para atualizar o banco
    await setWinner(id, winner);

    res.json({ message: "Bingo finalizado!", winner: winner });
  } catch (error) {
    console.error("Erro no finishBingo:", error);
    res.status(500).json({ message: "Erro ao finalizar bingo" });
  }
}