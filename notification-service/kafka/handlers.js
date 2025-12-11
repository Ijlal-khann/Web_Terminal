const Notification = require('../models/Notification');
const { addNotification } = require('../redis/client');

const handleAppointmentBooked = async (data) => {
  try {
    const message = `New appointment: ${data.patientName} on ${new Date(data.date).toLocaleDateString()}`;
    
    // Save to MongoDB (permanent)
    const notification = await Notification.create({
      message,
      role: 'doctor',
      appointmentId: data.appointmentId,
      eventType: 'APPOINTMENT_BOOKED',
      targetEmail: data.patientEmail
    });

    // Save to Redis (fast access)
    await addNotification('doctor', {
      id: notification._id.toString(),
      message,
      createdAt: notification.createdAt,
      appointmentId: data.appointmentId,
      read: false
    });
    
    console.log('Appointment booked notification created');
  } catch (error) {
    console.error('Handle appointment booked error:', error);
  }
};

const handleAppointmentApproved = async (data) => {
  try {
    const message = `Your appointment on ${new Date(data.date).toLocaleDateString()} has been approved!`;
    
    const notification = await Notification.create({
      message,
      role: 'patient',
      targetEmail: data.patientEmail,
      appointmentId: data.appointmentId,
      eventType: 'APPOINTMENT_APPROVED'
    });

    await addNotification('patient', {
      id: notification._id.toString(),
      message,
      createdAt: notification.createdAt,
      appointmentId: data.appointmentId,
      read: false
    });
    
    console.log('Appointment approved notification created');
  } catch (error) {
    console.error('Handle appointment approved error:', error);
  }
};

const handleAppointmentRejected = async (data) => {
  try {
    const message = `Your appointment has been rejected.`;
    
    const notification = await Notification.create({
      message,
      role: 'patient',
      targetEmail: data.patientEmail,
      appointmentId: data.appointmentId,
      eventType: 'APPOINTMENT_REJECTED'
    });

    await addNotification('patient', {
      id: notification._id.toString(),
      message,
      createdAt: notification.createdAt,
      appointmentId: data.appointmentId,
      read: false
    });
    
    console.log('Appointment rejected notification created');
  } catch (error) {
    console.error('Handle appointment rejected error:', error);
  }
};

module.exports = {
  APPOINTMENT_BOOKED: handleAppointmentBooked,
  APPOINTMENT_APPROVED: handleAppointmentApproved,
  APPOINTMENT_REJECTED: handleAppointmentRejected
};

