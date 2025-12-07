/**
 * Main Application Entry Point
 * Sets up Express server and registers routes
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const salesRoutes = require('./routes/sales.routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Register routes
app.use('/api/sales', salesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 Active port: ${PORT} (from ${process.env.PORT ? 'environment variable' : 'default'})`);
  console.log(`🏥 Health check: /health`);
  console.log(`📊 Sales API: /api/sales`);
});

module.exports = app;

