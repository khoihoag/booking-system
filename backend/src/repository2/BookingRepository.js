const pool = require('../config/database');

const load = async (where = '', params = []) => {
    const [rows] = await pool.execute(`SELECT b.*, u.name AS user_name, u.email AS user_email, ts.id AS slot_id, ts.pitch_id, p.name AS pitch_name, p.address AS pitch_address FROM bookings b JOIN users u ON u.id = b.user_id LEFT JOIN booking_time_slots bts ON bts.booking_id = b.id LEFT JOIN time_slots ts ON ts.id = bts.time_slot_id LEFT JOIN pitches p ON p.id = ts.pitch_id ${where} ORDER BY b.booking_date DESC, b.created_at DESC`, params);
    const result = new Map();
    for (const row of rows) { let booking = result.get(row.id); if (!booking) { booking = { ...row, _id: row.id, userId: row.user_id, date: row.booking_date, timeSlotId: [], userId: { id: row.user_id, name: row.user_name, email: row.user_email } }; delete booking.slot_id; result.set(row.id, booking); } if (row.slot_id) booking.timeSlotId.push({ _id: row.slot_id, pitchId: row.pitch_id, pitch: { id: row.pitch_id, name: row.pitch_name, address: row.pitch_address } }); }
    return [...result.values()];
};
exports.create = async (data) => { const ids = Array.isArray(data.timeSlotId) ? data.timeSlotId : [data.timeSlotId]; const conn = await pool.getConnection(); try { await conn.beginTransaction(); const [r] = await conn.execute('INSERT INTO bookings (user_id, booking_date, status, expires_at) VALUES (?, ?, ?, ?)', [data.userId, data.date, data.status || 'pending', data.expiresAt || new Date(Date.now() + 600000)]); for (const id of ids) await conn.execute('INSERT INTO booking_time_slots (booking_id, time_slot_id) VALUES (?, ?)', [r.insertId, id]); await conn.commit(); return (await load('WHERE b.id = ?', [r.insertId]))[0]; } catch (e) { await conn.rollback(); throw e; } finally { conn.release(); } };
exports.findAll = async (filter = {}) => load(filter.status ? 'WHERE b.status = ?' : '', filter.status ? [filter.status] : []);
exports.findById = async (id) => (await load('WHERE b.id = ?', [id]))[0];
exports.findByUser = async (userId) => load('WHERE b.user_id = ?', [userId]);
exports.findByPitchIdNDate = async (pitchId, date) => load("WHERE b.booking_date = ? AND b.status <> 'cancelled' AND EXISTS (SELECT 1 FROM booking_time_slots x JOIN time_slots y ON y.id = x.time_slot_id WHERE x.booking_id = b.id AND y.pitch_id = ?)", [date, pitchId]);
exports.expirePending = async () => { const [r] = await pool.execute("UPDATE bookings SET status = 'cancelled' WHERE status = 'pending' AND expires_at <= NOW()"); return r; };
exports.update = async (id, data) => { const fields = Object.keys(data).filter((f) => ['status', 'paid_at', 'refunded_at', 'completed_at'].includes(f)); if (!fields.length) return exports.findById(id); const [r] = await pool.execute(`UPDATE bookings SET ${fields.map((f) => `${f} = ?`).join(', ')} WHERE id = ?`, [...fields.map((f) => data[f]), id]); return r.affectedRows ? exports.findById(id) : null; };
exports.delete = async (id) => { const old = await exports.findById(id); if (!old) return null; await pool.execute('DELETE FROM bookings WHERE id = ?', [id]); return old; };
