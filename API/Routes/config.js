const { Storage } = require('@google-cloud/storage');
const mysql = require('mysql');
require('dotenv').config();

// Cloud Storage Configuration
const keyFilePath = './storageCredentials.json';
const storage = new Storage({
  keyFilename: keyFilePath,
  projectId: 'dev-test-405901',
});
const bucketName = 'fruityfit-bucket';
const bucket = storage.bucket(bucketName);

// MySQL Connection
const db = mysql.createConnection({
  host: '34.101.92.126',
  user: 'root',
  password: 'fruityfit',
  database: 'ff-db',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
  }
});

module.exports = { storage, bucket, bucketName, db };
