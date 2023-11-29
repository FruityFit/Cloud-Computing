const { db, bucketName, bucket } = require('./config');
const jwt = require('jsonwebtoken');
const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer();
const secretKey = process.env.JWT_SECRET;

// Sign Up
router.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
  
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (results.length > 0) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }

      db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        res.json({ message: 'Registrasi Berhasil' });
      });
    });
});

// Sign In
router.post('/signin', (req, res) => {
    const { identifier, password } = req.body;
    
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [identifier, identifier], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (results.length > 0) {
        const storedPassword = results[0].password;
        if (password === storedPassword) {
          const token = jwt.sign({ username: results[0].username, email: results[0].email }, secretKey, { expiresIn: '1h' });
          res.json({ token });
        } else {
          res.status(401).json({ message: 'Password tidak sesuai' });
        }
      } else {
        res.status(401).json({ message: 'Username atau email tidak sesuai' });
      }
  });
});

// Sign out
router.post('/signout', (req, res) => {
  res.status(200).json({ message: 'Logout sukses' });
});

// User's Profile
router.get('/:userId', (req, res) => {
    const userId = req.params.userId;

    const sql = 'SELECT username, email, pfp_url FROM users WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Error retrieving user information from MySQL:', err);
        res.status(500).send('Internal Server Error');
      } else {
        if (results.length > 0) {
          const user = results[0];
          res.status(200).json(user);
        } else {
          res.status(404).send('User tidak ditemukan.');
        }
      }
    });
});

// Edit username
router.put('/edit/:userId', (req, res) => {
    const userId = req.params.userId;
    const { newUsername } = req.body;
  
    const sql = 'UPDATE users SET username = ? WHERE user_id = ?';
    db.query(sql, [newUsername, userId], (err, result) => {
      if (err) {
        console.error('Error updating username in MySQL:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).send('Username berhasil diperbarui');
      }
    });
});

// Update Profile Picture
router.post('/upload/:userId', upload.single('image'), (req, res) => {
    const userId = req.params.userId;

    if (!req.file) {
      return res.status(400).send('Tidak ada file yang dipilih.');
    }
  
    // Upload file ke Cloud Storage
    const fileName = `pfp/${userId}`;
    const file = bucket.file(fileName);
    
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });
  
    stream.on('error', (err) => {
      console.error('Error uploading to GCS:', err);
      res.status(500).send('Internal Server Error');
    });
  
    stream.on('finish', () => {
      const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
  
      // Update pfp_url
      const sql = 'UPDATE users SET pfp_url = ? WHERE user_id = ?';
      db.query(sql, [imageUrl, userId], (err) => {
        if (err) {
          console.error('Error updating profile picture URL in MySQL:', err);
          res.status(500).send('Internal Server Error');
        } else {
          res.status(200).send('File berhasil diperbarui.');
        }
      });
    });
  
    stream.end(req.file.buffer);
});

module.exports = router;
