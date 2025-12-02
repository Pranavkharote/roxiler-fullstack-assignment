const bcrypt = require("bcrypt");
const pool = require("../config/db");

async function InsertAdmin() {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await pool.query(
    `INSERT INTO users (name, email, password, address, role_id)
        VALUES($1, $2, $3, $4, $5)`,
    ["System Admin", "admin@roxiler.com", hashedPassword, "Admin Address", 1]
  );
  console.log("User Admin Inserted successfully.!");
  process.exit();
}
InsertAdmin();
