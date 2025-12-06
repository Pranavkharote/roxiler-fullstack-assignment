const pool = require("./src/config/db");

(async () => {
  try {
    console.log("⚠️ Cleaning database...");

    // ✅ Keep only SYSTEM_ADMIN
    await pool.query(`DELETE FROM users WHERE role != 'SYSTEM_ADMIN'`);

    // ✅ Delete all stores
    await pool.query(`DELETE FROM stores`);

    // ✅ Delete all ratings
    await pool.query(`DELETE FROM ratings`);

    console.log("✅ Database cleaned successfully (Admin preserved)");
  } catch (err) {
    console.error("❌ Database cleanup failed:", err.message);
  } finally {
    await pool.end(); // ✅ important to close connection
    process.exit();
  }
})();
