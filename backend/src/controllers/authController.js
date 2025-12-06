const bcrypt = require("bcrypt");
const crypto = require("crypto");
const pool = require("../config/db");
const jwt = require("jsonwebtoken"); 

const register = async (req, res) => {
  const { name, email, password, address } = req.body;

  try {

    const exists = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (name, email, password, address, role_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, hashed, address, 2]
    );

    res.status(201).json({ msg: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      `SELECT users.*, roles.name as role_name
            FROM users
            JOIN roles ON users.role_id = roles.id
            WHERE email=$1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updatePassword = async (req, res) => {
  const userId = req.user.userId;

  const { oldPass, newPass } = req.body;

  if (!oldPass || !newPass) {
    return res.status(400).json({ msg: "old and new password required" });
  }

  try {
    const userRes = await pool.query("SELECT password FROM users WHERE id=$1", [userId]);

    if (userRes.rows.length === 0) {
      return res.status(404).json({ msg: "user not found" });
    }

    const user = userRes.rows[0];

    
    const match = await bcrypt.compare(oldPass, user.password);
    if (!match) {
      return res.status(400).json({ msg: "old password incorrect" });
    }

    const hashed = await bcrypt.hash(newPass, 10);

    await pool.query(
      "UPDATE users SET password=$1 WHERE id=$2",
      [hashed, userId]
    );

    return res.json({ msg: "password updated" });

  } catch (err) {
    console.log("update pass err", err);
    res.status(500).json({ msg: "server error" });
  }
};


module.exports = {login, register, updatePassword}