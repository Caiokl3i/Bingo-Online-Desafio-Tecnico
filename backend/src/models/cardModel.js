import db from "../database/db.js";

export async function createCard({ bingoId, userId, numbers }) {
  return db.run(
    `INSERT INTO cards (bingoId, userId, numbers, markedNumbers)
     VALUES (?, ?, ?, ?)`,
    [bingoId, userId, JSON.stringify(numbers), JSON.stringify([])]
  );
}

export async function findByUserAndBingo(bingoId, userId) {
  const card = await db.get(
    "SELECT * FROM cards WHERE bingoId = ? AND userId = ?",
    [bingoId, userId]
  );
  if (!card) return null;
  card.numbers = JSON.parse(card.numbers);
  card.markedNumbers = JSON.parse(card.markedNumbers);
  return card;
}

export async function updateMarkedNumbers(cardId, markedNumbers) {
  return db.run(
    "UPDATE cards SET markedNumbers = ? WHERE id = ?",
    [JSON.stringify(markedNumbers), cardId]
  );
}

export async function getUserHistory(userId) {
  // Essa query traz os dados do Bingo baseado nas cartelas que o usuário tem
  return db.all(
    `SELECT DISTINCT b.id, b.prize, b.status, b.winner 
     FROM cards c 
     JOIN bingos b ON c.bingoId = b.id 
     WHERE c.userId = ? 
     ORDER BY b.id DESC`,
    [userId]
  );
}
