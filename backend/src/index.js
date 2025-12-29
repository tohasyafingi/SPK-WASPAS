/**
 * Main Express Server
 * SPK WASPAS Backend
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './database/db.supabase.js';
import { runMigrations } from './database/migrations.js';

// Import routes
import authRoutes from './routes/auth.js';
import kandidatRoutes from './routes/kandidat.js';
import kriteriaRoutes from './routes/kriteria.js';
import penilaianRoutes from './routes/penilaian.js';
import hasilRoutes from './routes/hasil.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Allow requests from any origin (suitable for token-based auth without cookies)
const corsOptions = {
  origin: (origin, callback) => callback(null, true),
  credentials: false
};

// ==========================================
// MIDDLEWARE
// ==========================================

// CORS
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==========================================
// API ROUTES
// ==========================================

// Auth routes (public & protected)
app.use('/api/auth', authRoutes);

// Kandidat routes
app.use('/api/kandidat', kandidatRoutes);

// Kriteria routes
app.use('/api/kriteria', kriteriaRoutes);

// Penilaian routes
app.use('/api/penilaian', penilaianRoutes);

// WASPAS Hasil routes
app.use('/api/hasil', hasilRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'SPK WASPAS Backend is running',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==========================================
// SERVER STARTUP
// ==========================================

async function startServer() {
  try {
    // Initialize database
    await initDatabase();
    
    // Run migrations to create sessions table
    runMigrations();

    // Start server (bind to all interfaces for LAN access)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
╔═════════════════════════════════════════╗
║  SPK WASPAS Backend Server              ║
║  Listening on http://localhost:${PORT}    ║
╚═════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
