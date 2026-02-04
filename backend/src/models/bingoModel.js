import db from "../database/db.js";

export async function createBingoModel({ prize }) {
  return db.run(
    `INSERT INTO bingos (prize, status, drawnNumbers, winner)
     VALUES (?, ?, ?, ?)`,
    [prize, "waiting", JSON.stringify([]), null]
  );
}

export async function findById(id) {
  const bingo = await db.get("SELECT * FROM bingos WHERE id = ?", [id]);
  if (!bingo) return null;
  bingo.drawnNumbers = JSON.parse(bingo.drawnNumbers);
  return bingo;
}

export async function updateDrawnNumbers(id, numbers) {
  return db.run(
    "UPDATE bingos SET drawnNumbers = ? WHERE id = ?",
    [JSON.stringify(numbers), id]
  );
}

export async function setWinner(id, winnerName) {
  return db.run(
    "UPDATE bingos SET status = 'finished', winner = ? WHERE id = ?",
    [winnerName, id]
  );
}

export async function deleteBingo(id) {
  return db.run("DELETE FROM bingos WHERE id = ?", [id]);
}

export async function getAllBingos() {
  const bingos = await db.all("SELECT * FROM bingos");
  return bingos.map(b => ({ ...b, drawnNumbers: JSON.parse(b.drawnNumbers) }));
}
