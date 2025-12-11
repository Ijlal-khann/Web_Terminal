'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
            <p className="text-gray-600">Welcome, Dr. {user?.name}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Badge variant="outline" className="text-sm">
              {notifications.length} Notifications
            </Badge>
            <Button variant="outline" onClick={handleSync}>
              Sync Notifications
            </Button>
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
                  <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-200">
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

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All ({appointments.length})
          </Button>
          <Button 
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pending ({appointments.filter(a => a.status === 'pending').length})
          </Button>
          <Button 
            variant={filter === 'approved' ? 'default' : 'outline'}
            onClick={() => setFilter('approved')}
          >
            Approved ({appointments.filter(a => a.status === 'approved').length})
          </Button>
          <Button 
            variant={filter === 'rejected' ? 'default' : 'outline'}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({appointments.filter(a => a.status === 'rejected').length})
          </Button>
        </div>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Manage patient appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No appointments found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-xs text-gray-500">{appointment.patientEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.doctorName || 'General Doctor'}</p>
                          <p className="text-xs text-gray-500">{appointment.doctorEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(appointment.date).toLocaleString()}
                      </TableCell>
                      <TableCell>{appointment.reason}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell>
                        {appointment.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleApprove(appointment._id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleReject(appointment._id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
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

