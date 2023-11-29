const express = require('express');
const { db } = require('./config');
const router = express.Router();

// Fetch fruit's information 
router.get('/fruits/:fruitId', (req, res) => {
    const fruitId = req.params.fruitId;

    const sql = 'SELECT * FROM fruits WHERE fruit_id = ?';
    db.query(sql, [fruitId], (err, results) => {
      if (err) {
        console.error('Error retrieving user information from MySQL:', err);
        res.status(500).send('Internal Server Error');
      } else {
        if (results.length === 0) {
          res.status(404).send('Buah tidak ditemukan.');
        } else {
          res.json(results[0]);
        }
      }
    });
});

// Add to favorites
router.post('/add-fav/:userId', (req, res) => {
    const userId = req.params.userId;
    const { productId } = req.body;
  
    const sql = 'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)';
    db.query(sql, [userId, productId], (err, result) => {
      if (err) {
        console.error('Error adding product to favorites in MySQL:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).send('Produk berhasil ditambahkan ke favorit.');
      }
    });
});

// Delete from favorites
router.post('/del-fav/:userId', (req, res) => {
    const userId = req.params.userId;
    const { productId } = req.body;
  
    const sql = 'DELETE FROM favorites WHERE user_id = ? AND product_id = ?';
    db.query(sql, [userId, productId], (err, result) => {
      if (err) {
        console.error('Error adding product to favorites in MySQL:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).send('Produk berhasil dihapus dari favorit.');
      }
    });
});

router.get('/favorites/:userId', (req, res) => {
    const userId = req.params.userId;

    const sql = `SELECT products.*
      FROM favorites
      JOIN products ON favorites.product_id = products.product_id
      WHERE favorites.user_id = ?`;
  
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching favorite products from MySQL:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(results);
      }
    });
});

module.exports = router;
