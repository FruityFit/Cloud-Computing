const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

app.use(bodyParser.json());

const userRoutes = require('./Routes/userRoutes');
const handlerRoutes = require('./Routes/handlerRoutes');

app.use('/user', userRoutes);
app.use('/', handlerRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Connection Test' });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
