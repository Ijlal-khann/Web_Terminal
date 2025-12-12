'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: '',
    reason: '',
    doctorEmail: '',
    doctorName: ''
  });

  useEffect(() => {
    fetchData();
    
    // Auto-sync notifications every 10 seconds
    const interval = setInterval(async () => {
      try {
        await api.notifications.sync();
        await fetchNotifications();
      } catch (error) {
        console.error('Auto-sync error:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [userData, appointmentsData, notificationsData, doctorsData] = await Promise.all([
        api.auth.me(),
        api.appointments.getAll(),
        api.notifications.get('patient'),
        api.appointments.getDoctors()
      ]);

      setUser(userData.user);
      setAppointments(appointmentsData.appointments || []);
      setNotifications(notificationsData.notifications || []);
      setDoctors(doctorsData.doctors || []);
    } catch (error: any) {
      toast.error('Failed to load data');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await api.notifications.get('patient');
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Fetch notifications error:', error);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await api.appointments.create(formData);
      toast.success('Appointment created successfully!');
      setFormData({ date: '', reason: '', doctorEmail: '', doctorName: '' });
      
      // Refresh appointments
      const appointmentsData = await api.appointments.getAll();
      setAppointments(appointmentsData.appointments || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create appointment');
    }
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      router.push('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Animated Background */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl floating-animation"></div>
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl floating-animation" style={{animationDelay: '2s'}}></div>
      
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Modern Header */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl pulse-glow">
                👤
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">Patient Portal</h1>
                <p className="text-gray-400 text-lg">Welcome back, {user?.name}!</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="glass-card rounded-2xl px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">{notifications.length} New</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-2xl border-2 border-red-500/50 text-red-300 font-semibold hover:bg-red-500/10 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card-hover rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Appointments</p>
                <h3 className="text-3xl font-bold text-white">{appointments.length}</h3>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
                📅
              </div>
            </div>
          </div>
          <div className="glass-card-hover rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Pending</p>
                <h3 className="text-3xl font-bold text-yellow-400">
                  {appointments.filter(a => a.status === 'pending').length}
                </h3>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl">
                ⏳
              </div>
            </div>
          </div>
          <div className="glass-card-hover rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Approved</p>
                <h3 className="text-3xl font-bold text-green-400">
                  {appointments.filter(a => a.status === 'approved').length}
                </h3>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-2xl">
                ✅
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                🔔
              </div>
              <h2 className="text-2xl font-bold text-white">Recent Notifications</h2>
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notif, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-4 border border-purple-500/30 hover:border-pink-500/50 transition-all duration-300">
                  <p className="text-white">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Appointment Form */}
        <div className="glass-card rounded-3xl p-8 pulse-glow">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl">
              ➕
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Book Appointment</h2>
              <p className="text-gray-400">Schedule a visit with your doctor</p>
            </div>
          </div>
          
          <form onSubmit={handleCreateAppointment} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="doctor" className="block text-sm font-semibold text-cyan-300">
                Select Doctor
              </label>
              <select
                id="doctor"
                className="w-full px-4 py-4 input-glow"
                value={formData.doctorEmail}
                onChange={(e) => {
                  const selectedDoctor = doctors.find(d => d.email === e.target.value);
                  setFormData({ 
                    ...formData, 
                    doctorEmail: e.target.value,
                    doctorName: selectedDoctor?.name || ''
                  });
                }}
                required
              >
                <option value="">Choose a doctor...</option>
                {doctors.map((doctor) => (
                  <option key={doctor.email} value={doctor.email}>
                    Dr. {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label htmlFor="date" className="block text-sm font-semibold text-cyan-300">
                Appointment Date & Time
              </label>
              <input
                id="date"
                type="datetime-local"
                className="w-full px-4 py-4 input-glow"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="reason" className="block text-sm font-semibold text-cyan-300">
                Reason for Visit
              </label>
              <textarea
                id="reason"
                className="w-full px-4 py-4 input-glow resize-none"
                rows={4}
                placeholder="Describe your symptoms or reason for visit..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="w-full py-4 gradient-button">
              Book Appointment 🗓️
            </button>
          </form>
        </div>

        {/* Appointments List */}
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-2xl">
              📋
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">My Appointments</h2>
              <p className="text-gray-400">View and track your appointments</p>
            </div>
          </div>
          
          {appointments.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-400 text-lg">No appointments yet</p>
              <p className="text-gray-500 text-sm">Book your first appointment above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-purple-300 font-semibold">Date & Time</th>
                    <th className="text-left py-4 px-4 text-purple-300 font-semibold">Reason</th>
                    <th className="text-left py-4 px-4 text-purple-300 font-semibold">Status</th>
                    <th className="text-left py-4 px-4 text-purple-300 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment._id} className="border-b border-white/5 table-row-hover">
                      <td className="py-4 px-4 text-white">
                        {new Date(appointment.date).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-gray-300">{appointment.reason}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          appointment.status === 'approved' 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                            : appointment.status === 'rejected'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                        }`}>
                          {appointment.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-400">
                        {new Date(appointment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

