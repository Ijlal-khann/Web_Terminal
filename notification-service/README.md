# Notification Service

Notification processing microservice with Kafka consumer and Upstash Redis.

## Features

- Kafka event consumption (5s polling for serverless)
- Upstash Redis for fast notification access
- MongoDB for permanent notification history
- Event handlers for different appointment events

## Environment Variables

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare_db
KAFKA_BROKERS=seed-xxxxx.cloud.redpanda.com:9092
KAFKA_USERNAME=your_username
KAFKA_PASSWORD=your_password
KAFKA_SASL_MECHANISM=scram-sha-256
UPSTASH_REDIS_URL=rediss://default:password@host.upstash.io:port
NODE_ENV=development
```

## Local Development

```bash
npm install
npm run dev
```

Runs on `http://localhost:4003`

## Deployment

```bash
vercel --prod
```

Set environment variables in Vercel dashboard.

## Sync Endpoint

The `/api/sync` endpoint runs the Kafka consumer for 5 seconds to work around Vercel's serverless timeout limits. It's called:
- Manually by doctor dashboard "Sync" button
- Automatically every 10 seconds by both dashboards

