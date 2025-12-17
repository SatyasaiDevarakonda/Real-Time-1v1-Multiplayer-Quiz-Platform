require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const initializeSocket = require('./socket/socketHandler');
const Question = require('./models/Question');
const Room = require('./models/Room');

const app = express();
const server = http.createServer(app);

// CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Initialize Socket.IO
initializeSocket(io);

// REST API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Quiz server is running' });
});

// Get question count (useful for debugging)
app.get('/api/questions/count', async (req, res) => {
  try {
    const count = await Question.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get active rooms count
app.get('/api/rooms/active', async (req, res) => {
  try {
    const count = await Room.countDocuments({ status: { $ne: 'finished' } });
    res.json({ activeRooms: count });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Cleanup old finished rooms (run periodically)
const cleanupOldRooms = async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    await Room.deleteMany({
      status: 'finished',
      updatedAt: { $lt: oneHourAgo }
    });
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};

// Run cleanup every hour
setInterval(cleanupOldRooms, 60 * 60 * 1000);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO listening for connections`);
});
