const pool = require("../config/db");
const bcrypt = require("bcrypt");

exports.addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    if (!name || !email || !password || !address || !role) {
      return res.status(40).json({ message: "All fileds are required" });
    }
    const exists = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const roleResult = await pool.query("SELECT id FROM roles WHERE name=$1", [
      role,
    ]);
    if (roleResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const roleId = roleResult.rows[0].id;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password, address, role_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, hashedPassword, address || "", roleId]
    );

    res.json({ message: "User created successfully", owner_id: owner_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;

  try {
    // 1. validate
    if (!name || !address || !owner_id) {
      return res.status(400).json({ message: "Name, address and owner_id required" });
    }

    // 2. check owner exists
    const owner = await pool.query(
      `SELECT * FROM users WHERE id=$1 AND role_id=3`,
      [owner_id]
    );

    if (owner.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or non-store-owner user" });
    }

    // 3. insert store
    await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)`,
      [name, email || "", address, owner_id]
    );

    res.json({ message: "Store created successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDashboard = async (req, res) => {
  try {

    const usersCount = await pool.query("SELECT COUNT(*) FROM users");
    const storesCount = await pool.query("SELECT COUNT(*) FROM stores");
    const ratingsCount = await pool.query("SELECT COUNT(*) FROM ratings");

    return res.json({
      total_users: Number(usersCount.rows[0].count),
      total_stores: Number(storesCount.rows[0].count),
      total_ratings: Number(ratingsCount.rows[0].count)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    return res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getStores = async (req, res) => {
  try{
    const result = await pool.query("SELECT * FROM stores");
    return res.json({users: result.rows})
  } catch(err) {
    console.log(err);
    res.status(500).json({message: "Server Error"});
  }
};
