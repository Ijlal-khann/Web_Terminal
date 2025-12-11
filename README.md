# Smart Healthcare Appointment System

A full-stack healthcare appointment management system built with Next.js frontend and 3 Express microservices backend, deployed on Vercel.

## Architecture

- **Client**: Next.js 15 with App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Auth Service**: Express microservice for user authentication with JWT
- **Appointment Service**: Express microservice for appointment management with Kafka producer
- **Notification Service**: Express microservice with Kafka consumer and Upstash Redis

## Key Features

- 🔐 JWT-based authentication with HttpOnly cookies
- 📅 Appointment booking and management
- 🔔 Real-time notifications via Kafka events
- 🚀 Serverless deployment on Vercel
- 🎨 Modern UI with shadcn/ui components
- 🔄 Auto-sync notifications every 10 seconds

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Next.js Rewrites (Reverse Proxy)

### Backend
- Express.js
- MongoDB Atlas (with Mongoose)
- Redpanda (Kafka-compatible event streaming)
- Upstash Redis (Notification caching)
- JWT Authentication
- Cookie-based sessions

## Project Structure

```
healthcare-system/
├── client/                    # Next.js frontend
├── auth-service/             # Authentication microservice
├── appointment-service/      # Appointment management microservice
├── notification-service/     # Notification processing microservice
└── README.md
```

## Local Development

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier)
- Redpanda Cloud account (Kafka, free tier)
- Upstash account (Redis, free tier)
- Vercel CLI (for local development)

### Setup Instructions

1. **Clone and navigate to the project:**
   ```bash
   cd healthcare-system
   ```

2. **Set up Auth Service:**
   ```bash
   cd auth-service
   npm install
   
   # Create .env file
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   
   # Run locally
   npm run dev
   # Runs on http://localhost:4001
   ```

3. **Set up Appointment Service:**
   ```bash
   cd appointment-service
   npm install
   
   # Create .env file
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   KAFKA_BROKERS=seed-xxxxx.cloud.redpanda.com:9092
   KAFKA_USERNAME=your_username
   KAFKA_PASSWORD=your_password
   KAFKA_SASL_MECHANISM=scram-sha-256
   NODE_ENV=development
   
   # Run locally
   npm run dev
   # Runs on http://localhost:4002
   ```

4. **Set up Notification Service:**
   ```bash
   cd notification-service
   npm install
   
   # Create .env file
   MONGO_URI=your_mongodb_connection_string
   KAFKA_BROKERS=seed-xxxxx.cloud.redpanda.com:9092
   KAFKA_USERNAME=your_username
   KAFKA_PASSWORD=your_password
   KAFKA_SASL_MECHANISM=scram-sha-256
   UPSTASH_REDIS_URL=your_redis_url
   NODE_ENV=development
   
   # Run locally
   npm run dev
   # Runs on http://localhost:4003
   ```

5. **Set up Client:**
   ```bash
   cd client
   npm install
   
   # Create .env.local file (leave empty for local dev)
   # NEXT_PUBLIC_AUTH_URL=
   # NEXT_PUBLIC_APPOINTMENT_URL=
   # NEXT_PUBLIC_NOTIFICATION_URL=
   
   # Run locally
   npm run dev
   # Runs on http://localhost:3000
   ```

## Vercel Deployment

### Prerequisites Setup

1. **MongoDB Atlas:**
   - Create a cluster and database `healthcare_db`
   - Whitelist all IPs (0.0.0.0/0) for Vercel functions
   - Copy connection string

2. **Redpanda Cloud:**
   - Create a Serverless cluster
   - Create topic: `appointments`
   - Generate SASL credentials
   - Copy bootstrap servers, username, and password

3. **Upstash Redis:**
   - Create Redis database
   - Copy connection URL

### Deploy Backend Services

Deploy each service individually:

```bash
# Auth Service
cd auth-service
vercel --prod
# Set environment variables in Vercel dashboard:
# - MONGO_URI
# - JWT_SECRET
# - NODE_ENV=production
# Copy deployment URL

# Appointment Service
cd appointment-service
vercel --prod
# Set environment variables in Vercel dashboard:
# - MONGO_URI
# - JWT_SECRET
# - KAFKA_BROKERS
# - KAFKA_USERNAME
# - KAFKA_PASSWORD
# - KAFKA_SASL_MECHANISM
# - NODE_ENV=production
# Copy deployment URL

# Notification Service
cd notification-service
vercel --prod
# Set environment variables in Vercel dashboard:
# - MONGO_URI
# - KAFKA_BROKERS
# - KAFKA_USERNAME
# - KAFKA_PASSWORD
# - KAFKA_SASL_MECHANISM
# - UPSTASH_REDIS_URL
# - NODE_ENV=production
# Copy deployment URL
```

### Deploy Frontend

```bash
cd client
vercel --prod
# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_AUTH_URL=https://your-auth-service.vercel.app
# - NEXT_PUBLIC_APPOINTMENT_URL=https://your-appointment-service.vercel.app
# - NEXT_PUBLIC_NOTIFICATION_URL=https://your-notification-service.vercel.app
```

## Usage

### User Roles

1. **Patient:**
   - Register/Login
   - Book appointments
   - View appointment status
   - Receive approval/rejection notifications

2. **Doctor:**
   - Register/Login
   - View all appointments
   - Approve/Reject appointments
   - Receive booking notifications
   - Manual sync button + auto-sync

### Testing Flow

1. Register a doctor account
2. Register a patient account
3. Login as patient → Create appointment
4. Login as doctor → Click "Sync Notifications" → See new appointment
5. Approve appointment
6. Login as patient → See approval notification (auto-synced)

## API Endpoints

### Auth Service
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Appointment Service
- `POST /api/appointments` - Create appointment (Patient)
- `GET /api/appointments` - Get appointments (Role-based)
- `PUT /api/appointments/approve/:id` - Approve appointment (Doctor)
- `PUT /api/appointments/reject/:id` - Reject appointment (Doctor)

### Notification Service
- `GET /api/notifications?role=doctor|patient` - Get notifications
- `GET /api/sync` - Trigger Kafka consumer (5s polling)

## Vercel-Specific Optimizations

1. **MongoDB Singleton Pattern**: Connection caching across invocations
2. **Kafka Quick Disconnect**: Producer/Consumer disconnect immediately
3. **Redis Caching**: Fast notification access
4. **5-Second Polling**: Workaround for serverless timeout limits
5. **Next.js Rewrites**: Reverse proxy for CORS/Cookie handling

## Security Features

- HttpOnly cookies for JWT storage
- Password hashing with bcrypt
- CORS configuration with credentials
- JWT expiration (24 hours)
- Environment-based secure cookie settings

## Troubleshooting

### Issue: Cookies not working
- Ensure `NODE_ENV=production` on Vercel
- Check `sameSite: 'none'` and `secure: true` settings
- Verify CORS allows credentials

### Issue: Kafka connection timeout
- Check broker URL and credentials
- Ensure topic `appointments` exists
- Verify SASL mechanism matches

### Issue: MongoDB connection error
- Whitelist 0.0.0.0/0 in MongoDB Atlas
- Check connection string format
- Verify network access settings

## License

MIT

## Contributors

Built for Advanced Web Technologies Lab Final Exam

