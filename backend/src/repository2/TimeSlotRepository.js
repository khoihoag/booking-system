const pool = require('../config/database');

const select = `SELECT ts.*, p.name AS pitch_name, p.address AS pitch_address FROM time_slots ts JOIN pitches p ON p.id = ts.pitch_id`;
const map = (row) => row && ({ ...row, _id: row.id, pitchId: row.pitch_id, pitch: { id: row.pitch_id, name: row.pitch_name, address: row.pitch_address } });

exports.create = async (data) => {
    const [result] = await pool.execute('INSERT INTO time_slots (pitch_id, start_time, end_time, price, is_peak_hour) VALUES (?, ?, ?, ?, ?)', [data.pitchId, data.start_time, data.end_time, data.price, data.is_peak_hour || false]);
    return exports.findById(result.insertId);
};
exports.findAll = async () => { const [rows] = await pool.query(`${select} ORDER BY ts.start_time`); return rows.map(map); };
exports.findById = async (id) => { const [rows] = await pool.execute(`${select} WHERE ts.id = ?`, [id]); return map(rows[0]); };
exports.findByPitchId = async (pitchId) => { const [rows] = await pool.execute(`${select} WHERE ts.pitch_id = ? ORDER BY ts.start_time`, [pitchId]); return rows.map(map); };
exports.findByIds = async (ids) => { if (!ids.length) return []; const [rows] = await pool.query(`${select} WHERE ts.id IN (?)`, [ids]); return rows.map(map); };
exports.updateMany = async (ids, data) => {
    if (!ids.length) return { affectedRows: 0 };
    const fields = Object.keys(data).filter((field) => ['start_time', 'end_time', 'price', 'is_peak_hour'].includes(field));
    if (!fields.length) return { affectedRows: 0 };
    const [result] = await pool.execute(`UPDATE time_slots SET ${fields.map((field) => `${field} = ?`).join(', ')} WHERE id IN (?)`, [...fields.map((field) => data[field]), ids]);
    return result;
};
exports.update = async (id, data) => {
    const fields = Object.keys(data).filter((field) => ['pitch_id', 'start_time', 'end_time', 'price', 'is_peak_hour'].includes(field));
    if (!fields.length) return exports.findById(id);
    const [result] = await pool.execute(`UPDATE time_slots SET ${fields.map((field) => `${field} = ?`).join(', ')} WHERE id = ?`, [...fields.map((field) => data[field]), id]);
    return result.affectedRows ? exports.findById(id) : null;
};
exports.delete = async (id) => { const old = await exports.findById(id); if (!old) return null; await pool.execute('DELETE FROM time_slots WHERE id = ?', [id]); return old; };
