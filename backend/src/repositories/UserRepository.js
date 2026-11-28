const pool = require("./../config/database");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

exports.create = async (data) => {
  const id = crypto.randomUUID();

  const sql = `
    INSERT INTO users (id, name, email, phoneNumber, password, role)
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
  const sql = `SELECT * FROM users`;

  const [result] = await pool.execute(sql);
  return result;
};

exports.findById = async (id, selectPassword = false) => {
  const columns = selectPassword
    ? "*"
    : "id, name, email, role, phoneNumber, passwordChangeAt";

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
    "SELECT * FROM users WHERE passwordResetToken = ? AND passwordResetExpires > NOW() LIMIT 1",
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
      "phoneNumber",
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
        phone: "phoneNumber",
        preferredType: "preferredType",
        preferredFoot: "preferredFoot",
        jerseyNumber: "jerseyNumber",
        twoFactorEnabled: "twoFactorEnabled",
        smsReminder: "smsReminder",
        zaloNotification: "zaloNotification",
        promoAlerts: "promoAlerts",
      })[field] || field,
  );
  const [result] = await pool.execute(
    `UPDATE users SET ${names.map((field) => `${field} = ?`).join(", ")} WHERE id = ?`,
    [...fields.map((field) => data[field]), id],
  );
  return result.affectedRows ? exports.findById(id) : null;
};

exports.saveUser = async (user) => {
  const fields = [
    "name",
    "email",
    "password",
    "role",
    "phoneNumber",
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
    "passwordResetToken",
    "passwordResetExpires",
  ];
  const updates = [];
  const values = [];

  for (const field of fields) {
    if (user[field] === undefined) continue;
    let value = user[field];
    if (
      field === "password" &&
      typeof value === "string" &&
      !value.startsWith("$2")
    ) {
      value = await bcrypt.hash(value, 12);
    }
    updates.push(`${field} = ?`);
    values.push(value ?? null);
  }

  if (updates.length) {
    await pool.execute(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, [
      ...values,
      user.id,
    ]);
  }
  return exports.findById(user.id, true);
};

exports.delete = async (id) => {
  const [result] = await pool.execute(
    "UPDATE users SET active = 0 WHERE id = ?",
    [id],
  );
  return result.affectedRows ? exports.findById(id) : null;
};
