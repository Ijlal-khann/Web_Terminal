# Quick Start Guide

Get the Healthcare Appointment System running locally in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- npm installed
- MongoDB Atlas account (free tier)
- Upstash account (Kafka + Redis, free tier)

## Step 1: Clone & Setup (2 minutes)

```bash
cd healthcare-system
```

## Step 2: External Services Setup (5 minutes)

### MongoDB Atlas (2 min)
1. Go to mongodb.com/cloud/atlas → Sign up/Login
2. Create cluster → Choose free tier
3. Create user: username/password
4. Network Access → Add IP: 0.0.0.0/0
5. Copy connection string

### Redpanda (2 min)
1. Go to cloud.redpanda.com → Sign up/Login
2. Create Serverless cluster (free tier)
3. Create topic: `appointments`
4. Go to Security → Create SASL credentials
5. Copy bootstrap servers, username, password

### Upstash Redis (1 min)
1. In Upstash console, create Redis database
2. Copy connection URL

## Step 3: Configure Services (2 minutes)

Create `.env` files in each service:

### auth-service/.env
```env
MONGO_URI=mongodb+srv://YOUR_CONNECTION_STRING
JWT_SECRET=my_super_secret_jwt_key_12345
NODE_ENV=development
```

### appointment-service/.env
```env
MONGO_URI=mongodb+srv://YOUR_CONNECTION_STRING
JWT_SECRET=my_super_secret_jwt_key_12345
KAFKA_BROKERS=seed-xxxxx.cloud.redpanda.com:9092
KAFKA_USERNAME=YOUR_USERNAME
KAFKA_PASSWORD=YOUR_PASSWORD
KAFKA_SASL_MECHANISM=scram-sha-256
NODE_ENV=development
```

### notification-service/.env
```env
MONGO_URI=mongodb+srv://YOUR_CONNECTION_STRING
KAFKA_BROKERS=seed-xxxxx.cloud.redpanda.com:9092
KAFKA_USERNAME=YOUR_USERNAME
KAFKA_PASSWORD=YOUR_PASSWORD
KAFKA_SASL_MECHANISM=scram-sha-256
UPSTASH_REDIS_URL=YOUR_REDIS_URL
NODE_ENV=development
```

### client/.env.local
```env
# Leave empty - defaults to localhost
```

## Step 4: Install & Run (1 minute)

Open 4 terminals:

**Terminal 1 - Auth Service:**
```bash
cd auth-service
npm install
npm run dev
```

**Terminal 2 - Appointment Service:**
```bash
cd appointment-service
npm install
npm run dev
```

**Terminal 3 - Notification Service:**
```bash
cd notification-service
npm install
npm run dev
```

**Terminal 4 - Client:**
```bash
cd client
npm install
npm run dev
```

## Step 5: Test It! (3 minutes)

1. Open http://localhost:3000
2. Register a doctor: doctor@test.com / test123
3. Logout, register a patient: patient@test.com / test123
4. Login as patient → Create an appointment
5. Logout, login as doctor → Click "Sync Notifications"
6. See the new appointment → Click "Approve"
7. Logout, login as patient → See approval notification!

## Done! 🎉

Your system is running locally. Ready for Vercel deployment? See [DEPLOYMENT.md](DEPLOYMENT.md)

## Troubleshooting

**Services won't start:**
- Check if ports 3000, 4001, 4002, 4003 are available
- Verify .env files are created
- Check Node.js version: `node --version` (should be 18+)

**MongoDB connection error:**
- Verify connection string format
- Check IP whitelist (0.0.0.0/0)
- Ensure user credentials are correct

**Redpanda/Kafka not working:**
- Verify broker URL doesn't have protocol prefix (no kafka://)
- Check SASL credentials in Redpanda console
- Ensure topic `appointments` exists
- Check if cluster is active

**Notifications not showing:**
- Click "Sync Notifications" button manually
- Check terminal logs for errors
- Verify Redis URL is correct

