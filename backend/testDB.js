const pool = require("./src/config/db");

(async () => {
  try {
    console.log("Cleaning database");

    await pool.query(`DELETE FROM users WHERE role != 'SYSTEM_ADMIN'`);
    await pool.query(`DELETE FROM stores`);
    await pool.query(`DELETE FROM ratings`);

    console.log("Database cleaned successfully");
  } catch (err) {
    console.error("Database cleanup failed:", err.message);
  } finally {
    await pool.end(); 
    process.exit();
  }
})();
