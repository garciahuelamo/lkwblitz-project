// src/server.js
require('dotenv').config();
const express = require('express');
const shippoRoutes = require('./routes/shippoRoutes');
const authRoutes = require('./auth/auth.routes');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use('/', authRoutes);
app.use('/', shippoRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
