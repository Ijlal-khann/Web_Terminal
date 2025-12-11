const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');
const Appointment = require('../models/Appointment');
const authMiddleware = require('../middleware/auth');
const { sendEvent } = require('../kafka/producer');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'appointment-service' });
});

// Create Appointment
app.post('/api/appointments', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    
    const { date, reason, doctorEmail, doctorName } = req.body;
    
    if (!date || !reason) {
      return res.status(400).json({ error: 'Date and reason are required' });
    }

    const appointment = await Appointment.create({
      patientEmail: req.user.email,
      patientName: req.user.name,
      doctorEmail: doctorEmail || 'general@clinic.com',
      doctorName: doctorName || 'General Doctor',
      date: new Date(date),
      reason,
      status: 'pending'
    });

    // Send Kafka Event
    try {
      await sendEvent('appointments', {
        event: 'APPOINTMENT_BOOKED',
        data: {
          appointmentId: appointment._id.toString(),
          patientEmail: appointment.patientEmail,
          patientName: appointment.patientName,
          date: appointment.date,
          reason: appointment.reason
        }
      });
    } catch (kafkaError) {
      console.error('Kafka error (non-blocking):', kafkaError);
      // Continue even if Kafka fails
    }

    res.status(201).json({ 
      message: 'Appointment created successfully',
      appointment 
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get List of Doctors
app.get('/api/doctors', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const User = require('../models/User');
    
    const doctors = await User.find({ role: 'doctor' })
      .select('name email')
      .lean();

    res.json({ doctors });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Appointments
app.get('/api/appointments', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    
    let query = {};
    
    if (req.user.role === 'patient') {
      query.patientEmail = req.user.email;
    }
    // Doctors see all appointments

    const appointments = await Appointment.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Approve Appointment
app.put('/api/appointments/approve/:id', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Only doctors can approve appointments' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Send Kafka Event
    try {
      await sendEvent('appointments', {
        event: 'APPOINTMENT_APPROVED',
        data: {
          appointmentId: appointment._id.toString(),
          patientEmail: appointment.patientEmail,
          patientName: appointment.patientName,
          date: appointment.date
        }
      });
    } catch (kafkaError) {
      console.error('Kafka error (non-blocking):', kafkaError);
    }

    res.json({ 
      message: 'Appointment approved',
      appointment 
    });
  } catch (error) {
    console.error('Approve appointment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reject Appointment
app.put('/api/appointments/reject/:id', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Only doctors can reject appointments' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Send Kafka Event
    try {
      await sendEvent('appointments', {
        event: 'APPOINTMENT_REJECTED',
        data: {
          appointmentId: appointment._id.toString(),
          patientEmail: appointment.patientEmail,
          patientName: appointment.patientName
        }
      });
    } catch (kafkaError) {
      console.error('Kafka error (non-blocking):', kafkaError);
    }

    res.json({ 
      message: 'Appointment rejected',
      appointment 
    });
  } catch (error) {
    console.error('Reject appointment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 4002;
  app.listen(PORT, () => {
    console.log(`✅ Appointment Service running on http://localhost:${PORT}`);
  });
}

module.exports = app;

