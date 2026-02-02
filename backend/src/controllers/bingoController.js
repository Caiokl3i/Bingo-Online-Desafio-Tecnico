import { bingos } from '../models/bingoModel.js';
import { cards } from '../models/cardModel.js';

export const createBingo = async (req, res) => {
    const { prize } = req.body

    const newBingo = {
        id: bingos.length+1,
        prize,
        status: "waiting",
        drawnNumbers: [],
        players: [],
        winner: null
    }

    bingos.push(newBingo)

    res.status(201).json(newBingo)
}

function generateCard() {
  const numbers = Array.from({ length: 75 }, (_, i) => i + 1);

  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  const selected = numbers.slice(0, 25);

  const matrix = [];
  while (selected.length) {
    matrix.push(selected.splice(0, 5));
  }

  return matrix;
}

export function joinBingo(req, res) {
  const { bingoId } = req.body;
  const userId = req.user.id;

  const bingo = bingos.find(b => b.id === Number(bingoId));
  if (!bingo) {
    return res.status(404).json({ message: 'Bingo não encontrado' });
  }

  const card = {
    id: cards.length + 1,
    bingoId: bingo.id,
    userId,
    numbers: generateCard(),
    markedNumbers: []
  };

  cards.push(card);
  bingo.players.push(userId);

  res.json(card);
}

export function drawNumber(req, res) {
  const { bingoId } = req.body;

  const bingo = bingos.find(b => b.id === Number(bingoId));
  if (!bingo) {
    return res.status(404).json({ message: 'Bingo não encontrado' });
  }

  const available = [];
  for (let i = 1; i <= 75; i++) {
    if (!bingo.drawnNumbers.includes(i)) {
      available.push(i);
    }
  }

  if (available.length === 0) {
    return res.json({ message: 'Todos os números já foram sorteados' });
  }

  const drawn = available[Math.floor(Math.random() * available.length)];
  bingo.drawnNumbers.push(drawn);

  res.json({ number: drawn });
}

export function markNumber(req, res) {
  const { bingoId, number } = req.body;
  const userId = req.user.id;

  const card = cards.find(
    c => c.bingoId === Number(bingoId) && c.userId === userId
  );

  if (!card) {
    return res.status(404).json({ message: 'Cartela não encontrada' });
  }

  if (!card.markedNumbers.includes(number)) {
    card.markedNumbers.push(number);
  }

  res.json(card);
}
