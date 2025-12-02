const bcrypt = require("bcrypt");
const crypt0 = require("crypto");
const pool = require("../config/db");

const register = async(req, res) => {
    const {name, email, password, address} = req.body;

    try{
        const exists = await pool.query("SELECT * FROM users WHERE email=$1",[email]);
        if(exists.rows.length > 0){
            return res.status(400).json({message: "Email already exists"});
        }

        const hashed = await bcrypt.hash(password, 10);

          await pool.query(
      `INSERT INTO users (name, email, password, address, role_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, hashed, address, 2] // role_id = 2 = NORMAL_USER
    );
    res.json({message: "User Registered successfully."})
    }
}     