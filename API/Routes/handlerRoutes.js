const express = require('express');
const { db } = require('./config');
const router = express.Router();

// Fetch list of fruit
router.get('/fruits', (req, res) => {
    const sql = 'SELECT fruit_id, name, imageurl FROM fruits';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error retrieving user information from MySQL:', err);
        res.status(500).send('Internal Server Error');
      } else {
          res.json(results);
      }
    });
});

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
        const response = {
          userId: userId,
          productId: productId,
          message: 'Produk berhasil ditambahkan ke favorit.'
        };
        res.status(200).json(response);
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
        const response = {
          userId: userId,
          productId: productId,
          message: 'Produk berhasil dihapus dari favorit.'
        };
        res.status(200).json(response);
      }
    });
});

router.get('/favorites/:userId', (req, res) => {
    const userId = req.params.userId;

    const sql = `SELECT products.product_id, products.name, products.imageurl
      FROM favorites
      JOIN products ON favorites.product_id = products.product_id
      WHERE favorites.user_id = ?`;
  
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching favorite products from MySQL:', err);
        res.status(500).send('Gagal menambahkan ke favorit');
      } else {
        res.status(200).json(results);
      }
    });
});

module.exports = router;
