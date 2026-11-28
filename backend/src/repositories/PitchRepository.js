const pool = require("../config/database");
const crypto = require("crypto");
const select =
  "SELECT p.*, u.name AS ownerName, u.email AS ownerEmail FROM pitches p LEFT JOIN users u ON u.id = p.ownerId";
const map = (row) =>
  row && {
    ...row,
    id: row.id,
    ownerId: row.ownerId,
    owner: { name: row.ownerName, email: row.ownerEmail },
  };

exports.create = async (data) => {
  const id = crypto.randomUUID();
  const [r] = await pool.execute(
    "INSERT INTO pitches (id, ownerId, name, address, status) VALUES (?, ?, ?, ?, ?)",
    [id, data.ownerId, data.name, data.address, data.status || "active"],
  );
  return exports.findOne({ id: id });
};
exports.findOne = async (filter = {}) => {
  const [rows] = await pool.execute(`${select} WHERE p.id = ? LIMIT 1`, [
    filter.id,
  ]);
  return map(rows[0]);
};
exports.findByFilter = async (filter = {}) => {
  const [rows] = await pool.execute(
    `${select} ${filter.ownerId ? "WHERE p.ownerId = ?" : ""}`,
    filter.ownerId ? [filter.ownerId] : [],
  );
  return rows.map(map);
};
exports.update = async (id, data) => {
  const fields = Object.keys(data).filter((f) =>
    ["ownerId", "name", "address", "status"].includes(f),
  );
  if (!fields.length) return exports.findOne({ id: id });
  const names = fields;
  const [r] = await pool.execute(
    `UPDATE pitches SET ${names.map((f) => `${f} = ?`).join(", ")} WHERE id = ?`,
    [...fields.map((f) => data[f]), id],
  );
  return r.affectedRows ? exports.findOne({ id: id }) : null;
};
exports.delete = async (id) => {
  const old = await exports.findOne({ id: id });
  if (!old) return null;
  await pool.execute("DELETE FROM pitches WHERE id = ?", [id]);
  return old;
};
