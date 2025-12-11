const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['doctor', 'patient', 'all'], 
    required: true 
  },
  targetEmail: { type: String },
  appointmentId: { type: String },
  eventType: { 
    type: String, 
    enum: ['APPOINTMENT_BOOKED', 'APPOINTMENT_APPROVED', 'APPOINTMENT_REJECTED'] 
  },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

