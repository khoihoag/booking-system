const pool = require("./../config/database");
const crypto = require('crypto')

exports.create = async (data) => {
  const id = crypto.randomUUID()

  const sql = `
    INSERT INTO users (id, name, email, phone_number, password, role)
    VALUE  (?, ?, ?, ?, ?, ?)`;
  
  console.log(sql)

  const [result] = await pool.execute(sql, [
    id,
    data.name,
    data.email,
    data.phoneNumber || null,
    data.password,
    data.role || "USER",
  ]);

  return { id: id, ...data };
};
