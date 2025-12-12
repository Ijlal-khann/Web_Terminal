'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function DoctorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchData();
    
    // Auto-sync notifications every 10 seconds
    const interval = setInterval(async () => {
      try {
        await api.notifications.sync();
        await fetchNotifications();
        await fetchAppointments();
      } catch (error) {
        console.error('Auto-sync error:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [userData, appointmentsData, notificationsData] = await Promise.all([
        api.auth.me(),
        api.appointments.getAll(),
        api.notifications.get('doctor')
      ]);

      setUser(userData.user);
      setAppointments(appointmentsData.appointments || []);
      setNotifications(notificationsData.notifications || []);
    } catch (error: any) {
      toast.error('Failed to load data');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const data = await api.appointments.getAll();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error('Fetch appointments error:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await api.notifications.get('doctor');
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Fetch notifications error:', error);
    }
  };

  const handleSync = async () => {
    try {
      const result = await api.notifications.sync();
      if (result.warning) {
        toast.warning(result.warning);
      } else {
        toast.success(`Synced! Processed ${result.count} messages`);
      }
      await fetchNotifications();
      await fetchAppointments();
    } catch (error: any) {
      toast.error('Sync failed - check console');
      console.error('Sync error:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.appointments.approve(id);
      toast.success('Appointment approved!');
      await fetchAppointments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.appointments.reject(id);
      toast.success('Appointment rejected');
      await fetchAppointments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject');
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


  const filteredAppointments = appointments.filter(appt => 
    filter === 'all' ? true : appt.status === filter
  );

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
      <div className="fixed top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl floating-animation"></div>
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl floating-animation" style={{animationDelay: '3s'}}></div>
      
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Modern Header */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-3xl pulse-glow">
                👨‍⚕️
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">Doctor Portal</h1>
                <p className="text-gray-400 text-lg">Welcome, Dr. {user?.name}!</p>
              </div>
            </div>
            <div className="flex gap-3 items-center flex-wrap">
              <div className="glass-card rounded-2xl px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">{notifications.length} Alerts</span>
              </div>
              <button
                onClick={handleSync}
                className="px-6 py-3 rounded-2xl border-2 border-cyan-500/50 text-cyan-300 font-semibold hover:bg-cyan-500/10 transition-all duration-300"
              >
                🔄 Sync
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-2xl border-2 border-red-500/50 text-red-300 font-semibold hover:bg-red-500/10 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card-hover rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total</p>
                <h3 className="text-3xl font-bold text-white">{appointments.length}</h3>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                📊
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
          <div className="glass-card-hover rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Rejected</p>
                <h3 className="text-3xl font-bold text-red-400">
                  {appointments.filter(a => a.status === 'rejected').length}
                </h3>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-2xl">
                ❌
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xl">
                📬
              </div>
              <h2 className="text-2xl font-bold text-white">Recent Notifications</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {notifications.slice(0, 6).map((notif, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-4 border border-green-500/30 hover:border-emerald-500/50 transition-all duration-300">
                  <p className="text-white text-sm">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="glass-card rounded-3xl p-2 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All ({appointments.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              filter === 'pending'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Pending ({appointments.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              filter === 'approved'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Approved ({appointments.filter(a => a.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              filter === 'rejected'
                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Rejected ({appointments.filter(a => a.status === 'rejected').length})
          </button>
        </div>

        {/* Appointments List */}
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
              📋
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Appointments</h2>
              <p className="text-gray-400">Manage patient appointments</p>
            </div>
          </div>
          
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-400 text-lg">No appointments found</p>
              <p className="text-gray-500 text-sm">Try adjusting your filter</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment._id} className="glass-card-hover rounded-2xl p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Patient Info */}
                    <div className="lg:col-span-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl">
                          🙋
                        </div>
                        <div>
                          <p className="font-semibold text-white">{appointment.patientName}</p>
                          <p className="text-xs text-gray-400">{appointment.patientEmail}</p>
                        </div>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="lg:col-span-3">
                      <p className="text-xs text-gray-500 mb-1">Appointment Date</p>
                      <p className="text-white font-medium">
                        {new Date(appointment.date).toLocaleString()}
                      </p>
                    </div>

                    {/* Reason */}
                    <div className="lg:col-span-3">
                      <p className="text-xs text-gray-500 mb-1">Reason</p>
                      <p className="text-gray-300 text-sm line-clamp-2">{appointment.reason}</p>
                    </div>

                    {/* Status */}
                    <div className="lg:col-span-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        appointment.status === 'approved' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                          : appointment.status === 'rejected'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                      }`}>
                        {appointment.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-2">
                      {appointment.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(appointment._id)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleReject(appointment._id)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

