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
  const userId = req.user.userId;

  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.name,
        s.address,
        COALESCE(AVG(r.rating), 0) AS avg_rating,

        (
          SELECT rating 
          FROM ratings 
          WHERE store_id = s.id AND user_id = $1
          LIMIT 1
        ) AS user_rating

      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
      ORDER BY s.name ASC;
    `, [userId]);

    res.json({ stores: result.rows });

  } catch (err) {
    console.log("user stores err", err);
    res.status(500).json({ msg: "server error" });
  }
};


exports.addOrUpdate = async (req, res) => {
  const userId = req.user.userId;     // from token
  const { store_id, rating } = req.body;

  if (!store_id || !rating) {
    return res.status(400).json({ msg: "store_id and rating required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ msg: "rating must be 1 to 5" });
  }

  try {
    // check existing
    const check = await pool.query(
      "SELECT * FROM ratings WHERE user_id=$1 AND store_id=$2",
      [userId, store_id]
    );

    if (check.rows.length > 0) {
      // update rating
      await pool.query(
        "UPDATE ratings SET rating=$1 WHERE user_id=$2 AND store_id=$3",
        [rating, userId, store_id]
      );

      return res.json({ msg: "rating updated" });
    }

    // insert new
    await pool.query(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3)",
      [userId, store_id, rating]
    );

    return res.json({ msg: "rating added" });

  } catch (err) {
    console.log("rate err", err);
    res.status(500).json({ msg: "server error" });
  }
};


