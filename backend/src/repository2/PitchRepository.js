const pool = require('../config/database');
const select = 'SELECT p.*, u.name AS owner_name, u.email AS owner_email FROM pitches p LEFT JOIN users u ON u.id = p.owner_id';
const map = (row) => row && ({ ...row, _id: row.id, ownerId: row.owner_id, owner: { name: row.owner_name, email: row.owner_email } });

exports.create = async (data) => { const [r] = await pool.execute('INSERT INTO pitches (owner_id, name, address, status) VALUES (?, ?, ?, ?)', [data.ownerId, data.name, data.address, data.status || 'active']); return exports.findOne({ _id: r.insertId }); };
exports.findOne = async (filter = {}) => { const [rows] = await pool.execute(`${select} WHERE p.id = ? LIMIT 1`, [filter._id]); return map(rows[0]); };
exports.findByFilter = async (filter = {}) => { const [rows] = await pool.execute(`${select} ${filter.ownerId ? 'WHERE p.owner_id = ?' : ''}`, filter.ownerId ? [filter.ownerId] : []); return rows.map(map); };
exports.update = async (id, data) => { const fields = Object.keys(data).filter((f) => ['owner_id', 'ownerId', 'name', 'address', 'status'].includes(f)); if (!fields.length) return exports.findOne({ _id: id }); const names = fields.map((f) => f === 'ownerId' ? 'owner_id' : f); const [r] = await pool.execute(`UPDATE pitches SET ${names.map((f) => `${f} = ?`).join(', ')} WHERE id = ?`, [...fields.map((f) => data[f]), id]); return r.affectedRows ? exports.findOne({ _id: id }) : null; };
exports.delete = async (id) => { const old = await exports.findOne({ _id: id }); if (!old) return null; await pool.execute('DELETE FROM pitches WHERE id = ?', [id]); return old; };
