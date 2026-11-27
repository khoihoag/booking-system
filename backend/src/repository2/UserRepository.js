const pool = require("./../config/database");
const crypto = require("crypto");

exports.create = async (data) => {
  const id = crypto.randomUUID();

  const sql = `
    INSERT INTO users (id, name, email, phone_number, password, role)
    VALUE  (?, ?, ?, ?, ?, ?)`;

  const [result] = await pool.execute(sql, [
    id,
    data.name,
    data.email,
    data.phoneNumber || data.phone || null,
    data.password,
    data.role || "user",
  ]);

  return { id: id, ...data };
};

exports.findAll = async () => {
  const sql = `SELECT id, name, email, role, phone_number AS phone FROM users WHERE active <> 0`;

  const [result] = await pool.execute(sql);
  return result;
};

exports.findById = async (id, selectPassword = false) => {
  const columns = selectPassword
    ? "*"
    : "id, name, email, role, phone_number AS phone";

  const sql = `
        SELECT ${columns}
        FROM users
        WHERE id = ?
    `;

  const [result] = await pool.execute(sql, [id]);

  return result[0];
};

exports.findByEmail = async (email, selectPassword = false) => {
  const columns = selectPassword ? "*" : "id, name, email, role";

  const sql = `
        SELECT ${columns}
        FROM users
        WHERE email = ?
    `;

  const [result] = await pool.execute(sql, [email]);

  return result[0];
};

exports.findByResetToken = async (hashedToken) => {
  const [result] = await pool.execute(
    "SELECT * FROM users WHERE password_reset_token = ? AND password_reset_expires > NOW() LIMIT 1",
    [hashedToken],
  );
  return result[0];
};

exports.update = async (id, data) => {
  const fields = Object.keys(data).filter((field) =>
    [
      "name",
      "email",
      "role",
      "phone",
      "phone_number",
      "city",
      "bio",
      "preferredType",
      "position",
      "preferredFoot",
      "jerseyNumber",
      "twoFactorEnabled",
      "smsReminder",
      "zaloNotification",
      "promoAlerts",
    ].includes(field),
  );
  if (!fields.length) return exports.findById(id);
  const names = fields.map(
    (field) =>
      ({
        phone: "phone_number",
        preferredType: "preferred_type",
        preferredFoot: "preferred_foot",
        jerseyNumber: "jersey_number",
        twoFactorEnabled: "two_factor_enabled",
        smsReminder: "sms_reminder",
        zaloNotification: "zalo_notification",
        promoAlerts: "promo_alerts",
      })[field] || field,
  );
  const [result] = await pool.execute(
    `UPDATE users SET ${names.map((field) => `${field} = ?`).join(", ")} WHERE id = ?`,
    [...fields.map((field) => data[field]), id],
  );
  return result.affectedRows ? exports.findById(id) : null;
};

exports.saveUser = async (user, options = {}) => {
  return await user.save(options);
};

exports.delete = async (id) => {
  const [result] = await pool.execute(
    "UPDATE users SET active = 0 WHERE id = ?",
    [id],
  );
  return result.affectedRows ? exports.findById(id) : null;
};
