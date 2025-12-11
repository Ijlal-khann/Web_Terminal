const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');
const Notification = require('../models/Notification');
const { getNotifications } = require('../redis/client');
const { consumeEvents } = require('../kafka/consumer');

const app = express();
let isSyncing = false; // prevent concurrent syncs

// Middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'notification-service' });
});

// Get Notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const { role } = req.query;
    
    if (!role || !['doctor', 'patient'].includes(role)) {
      return res.status(400).json({ error: 'Valid role required (doctor or patient)' });
    }

    // Try Redis first
    let notifications = await getNotifications(role);
    
    // Fallback to MongoDB if Redis is empty
    if (notifications.length === 0) {
      await connectDB();
      const dbNotifications = await Notification.find({ role })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
      
      notifications = dbNotifications.map(n => ({
        id: n._id.toString(),
        message: n.message,
        createdAt: n.createdAt,
        appointmentId: n.appointmentId,
        read: n.read
      }));
    }

    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Sync Endpoint (Serverless Kafka Consumer)
app.get('/api/sync', async (req, res) => {
  if (isSyncing) {
    return res.json({
      success: false,
      warning: 'Sync already running, please wait a few seconds'
    });
  }

  try {
    await connectDB();

    if (isSyncing) {
      return res.json({
        success: false,
        warning: 'Sync already running, please wait a few seconds'
      });
    }

    isSyncing = true;
    console.log('Starting Kafka sync...');

    try {
      const messagesProcessed = await consumeEvents(3000);
      res.json({ 
        success: true, 
        messagesProcessed,
        count: messagesProcessed.length
      });
    } catch (kafkaError) {
      console.error('Kafka sync error (non-blocking):', kafkaError.message);
      res.json({ 
        success: true, 
        messagesProcessed: [],
        count: 0,
        warning: 'Kafka sync failed - check Redpanda connectivity/ACLs'
      });
    } finally {
      isSyncing = false;
    }
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 4003;
  app.listen(PORT, () => {
    console.log(`✅ Notification Service running on http://localhost:${PORT}`);
  });
}

module.exports = app;

