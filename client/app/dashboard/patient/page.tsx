'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: 'default',
      approved: 'default',
      rejected: 'destructive'
    };
    
    return (
      <Badge variant={variants[status] || 'default'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Patient Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Badge variant="outline" className="text-sm">
              {notifications.length} Notifications
            </Badge>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notifications.slice(0, 5).map((notif, idx) => (
                  <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Appointment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Book New Appointment</CardTitle>
            <CardDescription>Schedule an appointment with a doctor</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctor">Select Doctor</Label>
                <select
                  id="doctor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="space-y-2">
                <Label htmlFor="date">Appointment Date & Time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <textarea
                  id="reason"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Describe your symptoms or reason for visit..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                />
              </div>
              <Button type="submit">Book Appointment</Button>
            </form>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle>My Appointments</CardTitle>
            <CardDescription>View and track your appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No appointments yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment._id}>
                      <TableCell>
                        {new Date(appointment.date).toLocaleString()}
                      </TableCell>
                      <TableCell>{appointment.reason}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell>
                        {new Date(appointment.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

