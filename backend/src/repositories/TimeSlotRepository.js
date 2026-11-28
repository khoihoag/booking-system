const pool = require("../config/database");
const crypto = require("crypto");

const select = `SELECT ts.*, p.name AS pitchName, p.address AS pitchAddress FROM timeSlots ts JOIN pitches p ON p.id = ts.pitchId`;
const map = (row) =>
  row && {
    ...row,
    id: row.id,
    pitchId: row.pitchId,
    pitch: {
      id: row.pitchId,
      name: row.pitchName,
      address: row.pitchAddress,
    },
  };

exports.create = async (data) => {
  const id = crypto.randomUUID();
  const [result] = await pool.execute(
    "INSERT INTO timeSlots (id, pitchId, startTime, endTime, price, isPeakHour) VALUES (?, ?, ?, ?, ?, ?)",
    [
      id,
      data.pitchId,
      data.startTime,
      data.endTime,
      data.price,
      data.isPeakHour || false,
    ],
  );
  return exports.findById(id);
};
exports.findAll = async () => {
  const [rows] = await pool.query(`${select} ORDER BY ts.startTime`);
  return rows.map(map);
};
exports.findById = async (id) => {
  const [rows] = await pool.execute(`${select} WHERE ts.id = ?`, [id]);
  return map(rows[0]);
};
exports.findByPitchId = async (pitchId) => {
  const [rows] = await pool.execute(
    `${select} WHERE ts.pitchId = ? ORDER BY ts.startTime`,
    [pitchId],
  );
  return rows.map(map);
};
exports.findByIds = async (ids) => {
  if (!ids.length) return [];
  const [rows] = await pool.query(`${select} WHERE ts.id IN (?)`, [ids]);
  return rows.map(map);
};
exports.updateMany = async (ids, data) => {
  if (!ids.length) return { affectedRows: 0 };
  const fields = Object.keys(data).filter((field) =>
    ["startTime", "endTime", "price", "isPeakHour"].includes(field),
  );
  if (!fields.length) return { affectedRows: 0 };
  const [result] = await pool.execute(
    `UPDATE timeSlots SET ${fields.map((field) => `${field} = ?`).join(", ")} WHERE id IN (?)`,
    [...fields.map((field) => data[field]), ids],
  );
  return result;
};
exports.update = async (id, data) => {
  const fields = Object.keys(data).filter((field) =>
    ["pitchId", "startTime", "endTime", "price", "isPeakHour"].includes(
      field,
    ),
  );
  if (!fields.length) return exports.findById(id);
  const [result] = await pool.execute(
    `UPDATE timeSlots SET ${fields.map((field) => `${field} = ?`).join(", ")} WHERE id = ?`,
    [...fields.map((field) => data[field]), id],
  );
  return result.affectedRows ? exports.findById(id) : null;
};
exports.delete = async (id) => {
  const old = await exports.findById(id);
  if (!old) return null;
  await pool.execute("DELETE FROM timeSlots WHERE id = ?", [id]);
  return old;
};
