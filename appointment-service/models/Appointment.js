const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientEmail: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorEmail: { type: String, default: 'general@clinic.com' },
  doctorName: { type: String, default: 'General Doctor' },
  date: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

