/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:4001';
    const apptUrl = process.env.NEXT_PUBLIC_APPOINTMENT_URL || 'http://localhost:4002';
    const notifUrl = process.env.NEXT_PUBLIC_NOTIFICATION_URL || 'http://localhost:4003';

    return [
      {
        source: '/api/auth/:path*',
        destination: `${authUrl}/api/auth/:path*`
      },
      {
        source: '/api/appointments/:path*',
        destination: `${apptUrl}/api/appointments/:path*`
      },
      {
        source: '/api/doctors',
        destination: `${apptUrl}/api/doctors`
      },
      {
        source: '/api/notifications/:path*',
        destination: `${notifUrl}/api/notifications/:path*`
      },
      {
        source: '/api/sync',
        destination: `${notifUrl}/api/sync`
      }
    ];
  }
};

module.exports = nextConfig;

