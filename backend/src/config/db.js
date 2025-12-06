const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool
  .connect()
  .then(() => console.log("PostgreSQL connected."))
  .catch((err) => console.error("Error occured during db connecttion", err));

module.exports = pool;
