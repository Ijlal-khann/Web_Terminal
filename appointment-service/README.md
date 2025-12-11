# Appointment Service

Appointment management microservice with Kafka event producer.

## Features

- Create, read, update appointments
- Role-based access (doctors see all, patients see own)
- Kafka event production for notifications
- MongoDB singleton pattern for Vercel

## Environment Variables

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
KAFKA_BROKERS=seed-xxxxx.cloud.redpanda.com:9092
KAFKA_USERNAME=your_username
KAFKA_PASSWORD=your_password
KAFKA_SASL_MECHANISM=scram-sha-256
NODE_ENV=development
```

## Local Development

```bash
npm install
npm run dev
```

Runs on `http://localhost:4002`

## Deployment

```bash
vercel --prod
```

Set environment variables in Vercel dashboard.

