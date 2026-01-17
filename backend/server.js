const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/api', (req, res) => {
  res.json({ message: "Hello from Backend v2!", db_status: mongoose.connection.readyState });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));