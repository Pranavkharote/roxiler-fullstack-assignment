const pool = require("../config/db");
exports.getOwnerDashboard = async (req, res) => {
  const owner_id = req.user.userId;

  try {
    const store = await pool.query(
      "SELECT id, name, address FROM stores WHERE owner_id=$1",
      [owner_id]
    );

    if (store.rows.length === 0) {
      return res.json({ store: null, msg: "No store found for this owner" });
    }

    const storeData = store.rows[0];

    const ratingData = await pool.query(`
      SELECT 
        users.name AS user_name,
        users.email AS user_email,
        ratings.rating
      FROM ratings
      JOIN users ON ratings.user_id = users.id
      WHERE ratings.store_id = $1
      ORDER BY ratings.rating DESC
    `, [storeData.id]);

    const avgResult = await pool.query(
      "SELECT COALESCE(AVG(rating),0) AS avg_rating FROM ratings WHERE store_id=$1",
      [storeData.id]
    );

    res.json({
      store: {
        id: storeData.id,
        name: storeData.name,
        address: storeData.address
      },
      avg_rating: Number(avgResult.rows[0].avg_rating),
      ratings: ratingData.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server error" });
  }
};
