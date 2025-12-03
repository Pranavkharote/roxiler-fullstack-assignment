const pool = require("../config/db")

exports.rateStore = async (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.userId;

  try {
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1–5" });
    }

    const store = await pool.query("SELECT * FROM stores WHERE id=$1", [store_id]);
    if (store.rows.length === 0) {
      return res.status(400).json({ message: "Store not found" });
    }

    const exists = await pool.query(
      "SELECT * FROM ratings WHERE user_id=$1 AND store_id=$2",
      [user_id, store_id]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "You already rated this store" });
    }

    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)`,
      [user_id, store_id, rating]
    );

    res.json({ message: "Rating submitted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateRating = async (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.userId;

  try {
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1–5" });
    }

    const exists = await pool.query(
      "SELECT * FROM ratings WHERE user_id=$1 AND store_id=$2",
      [user_id, store_id]
    );

    if (exists.rows.length === 0) {
      return res.status(400).json({ message: "You have not rated this store yet" });
    }

    await pool.query(
      "UPDATE ratings SET rating=$1 WHERE user_id=$2 AND store_id=$3",
      [rating, user_id, store_id]
    );

    res.json({ message: "Rating updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getStores = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        stores.id,
        stores.name,
        stores.email,
        stores.address,
        users.name AS owner_name,
        COALESCE(AVG(ratings.rating), 0) AS avg_rating
      FROM stores
      JOIN users ON stores.owner_id = users.id
      LEFT JOIN ratings ON stores.id = ratings.store_id
      GROUP BY stores.id, users.name
      ORDER BY stores.name ASC;
    `);

    res.json({ stores: result.rows });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

