require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./db');

const app = express();

// Security
app.use(helmet());

app.use(cors({
  origin: '*'
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
});

app.use(limiter);

app.use(express.json({ limit: '10mb' }));

// Connect DB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Home Route
app.get('/', (req, res) => {
  res.send('SVNSOUL API is running');
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: 'Server error',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SVNSOUL API running on port ${PORT}`);
});