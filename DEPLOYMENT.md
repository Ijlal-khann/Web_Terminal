# Deployment Guide

Complete step-by-step guide to deploy the Healthcare Appointment System to Vercel.

## Phase 1: Prerequisites Setup

### 1.1 MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database: `healthcare_db`
4. Create user with read/write access
5. Network Access → Add IP: `0.0.0.0/0` (Allow from anywhere for Vercel)
6. Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/healthcare_db
   ```

### 1.2 Redpanda (Kafka)

1. Go to [Redpanda Console](https://cloud.redpanda.com/)
2. Sign up for free account
3. Create new cluster (Serverless)
4. Create topic: `appointments`
   - Partitions: 3
   - Retention: 7 days
5. Go to Security → Create SASL credentials
6. Copy credentials:
   - Bootstrap servers (broker URL)
   - Username
   - Password
   - SASL Mechanism: `scram-sha-256`

### 1.3 Upstash Redis

1. In Upstash Console, create Redis database
2. Copy connection URL (starts with `rediss://`)

### 1.4 Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Phase 2: Deploy Backend Services

### 2.1 Install Vercel CLI

```bash
npm install -g vercel
vercel login
```

### 2.2 Deploy Auth Service

```bash
cd healthcare-system/auth-service

# Deploy to Vercel
vercel --prod

# When prompted:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? auth-service (or your choice)
# - Directory? ./
# - Override settings? No
```

After deployment:
1. Go to Vercel dashboard → Your project
2. Settings → Environment Variables
3. Add:
   ```
   MONGO_URI = mongodb+srv://...
   JWT_SECRET = your_generated_secret
   NODE_ENV = production
   ```
4. Redeploy: `vercel --prod`
5. Copy deployment URL: `https://auth-service-xxx.vercel.app`

### 2.3 Deploy Appointment Service

```bash
cd healthcare-system/appointment-service
vercel --prod
```

Environment variables:
```
MONGO_URI = mongodb+srv://...
JWT_SECRET = same_as_auth_service
KAFKA_BROKERS = seed-xxxxx.cloud.redpanda.com:9092
KAFKA_USERNAME = your_username
KAFKA_PASSWORD = your_password
KAFKA_SASL_MECHANISM = scram-sha-256
NODE_ENV = production
```

Copy deployment URL: `https://appointment-service-xxx.vercel.app`

### 2.4 Deploy Notification Service

```bash
cd healthcare-system/notification-service
vercel --prod
```

Environment variables:
```
MONGO_URI = mongodb+srv://...
KAFKA_BROKERS = seed-xxxxx.cloud.redpanda.com:9092
KAFKA_USERNAME = your_username
KAFKA_PASSWORD = your_password
KAFKA_SASL_MECHANISM = scram-sha-256
UPSTASH_REDIS_URL = rediss://default:...@host.upstash.io:port
NODE_ENV = production
```

Copy deployment URL: `https://notification-service-xxx.vercel.app`

## Phase 3: Deploy Frontend

```bash
cd healthcare-system/client
vercel --prod
```

Environment variables:
```
NEXT_PUBLIC_AUTH_URL = https://auth-service-xxx.vercel.app
NEXT_PUBLIC_APPOINTMENT_URL = https://appointment-service-xxx.vercel.app
NEXT_PUBLIC_NOTIFICATION_URL = https://notification-service-xxx.vercel.app
```

Copy deployment URL: `https://your-client-xxx.vercel.app`

## Phase 4: Testing

### 4.1 Health Checks

Test each service:
```bash
# Auth Service
curl https://auth-service-xxx.vercel.app/api/health

# Appointment Service
curl https://appointment-service-xxx.vercel.app/api/health

# Notification Service
curl https://notification-service-xxx.vercel.app/api/health
```

Expected response: `{"status":"ok","service":"..."}"`

### 4.2 Complete Flow Test

1. **Register Doctor:**
   - Open frontend URL
   - Click "Register"
   - Name: Dr. John, Email: doctor@test.com, Password: test123, Role: Doctor
   - Submit

2. **Register Patient:**
   - Logout
   - Register again
   - Name: Patient Jane, Email: patient@test.com, Password: test123, Role: Patient
   - Submit

3. **Book Appointment (Patient):**
   - Login as patient@test.com
   - Fill appointment form
   - Submit
   - Verify appointment appears in table with "PENDING" status

4. **Sync & View (Doctor):**
   - Logout, login as doctor@test.com
   - Click "Sync Notifications" button
   - Verify notification appears: "New appointment: Patient Jane on..."
   - Verify appointment appears in table

5. **Approve Appointment (Doctor):**
   - Click "Approve" on the pending appointment
   - Verify status changes to "APPROVED"

6. **View Approval (Patient):**
   - Logout, login as patient@test.com
   - Wait 10 seconds (auto-sync) or refresh
   - Verify notification: "Your appointment... has been approved!"
   - Verify appointment status is "APPROVED"

## Troubleshooting

### Issue: 401 Unauthorized

**Symptoms:** Login works but subsequent requests fail

**Solution:**
1. Check `NODE_ENV=production` is set in all services
2. Verify `JWT_SECRET` is identical in auth and appointment services
3. Clear browser cookies and try again
4. Check browser console for CORS errors

### Issue: Kafka Connection Failed

**Symptoms:** Appointments created but no notifications

**Solution:**
1. Verify Kafka credentials in Vercel environment variables
2. Check topic `appointments` exists
3. Test Kafka connection using Upstash console
4. Check notification service logs in Vercel dashboard

### Issue: MongoDB Connection Timeout

**Solution:**
1. Verify IP whitelist: 0.0.0.0/0 in MongoDB Atlas
2. Check connection string format
3. Ensure user has read/write permissions
4. Test connection using MongoDB Compass

### Issue: Next.js Rewrites Not Working

**Symptoms:** API calls fail with 404

**Solution:**
1. Verify `NEXT_PUBLIC_*_URL` variables are set correctly
2. Check `next.config.js` rewrites configuration
3. Redeploy client after updating environment variables
4. Clear Next.js cache: `rm -rf .next`

### Issue: Notifications Not Appearing

**Solution:**
1. Click "Sync Notifications" manually
2. Check Redis connection in notification service logs
3. Verify Kafka consumer is processing messages
4. Check `/api/sync` endpoint response

## Monitoring

### Vercel Dashboard

Monitor your deployments:
1. Go to Vercel dashboard
2. Select each project
3. Check:
   - Logs (Real-time function logs)
   - Analytics (Performance metrics)
   - Deployments (History)

### MongoDB Atlas

Monitor database:
1. Go to MongoDB Atlas
2. Check:
   - Metrics (Connection count, operations)
   - Collections (users, appointments, notifications)

### Redpanda & Upstash

Monitor Kafka and Redis:
1. **Redpanda Console**: Monitor Kafka
   - Messages/sec, Topic details
   - Consumer lag, Throughput
2. **Upstash Console**: Monitor Redis
   - Operations, Memory usage
   - Key count, Hit rate

## Production Checklist

- [ ] All services deployed successfully
- [ ] Environment variables set correctly
- [ ] Health checks pass for all services
- [ ] Register flow works
- [ ] Login flow works
- [ ] Appointment creation works
- [ ] Kafka events are produced
- [ ] Notifications sync works (manual + auto)
- [ ] Appointment approval works
- [ ] Patient receives approval notification
- [ ] MongoDB contains data in all collections
- [ ] Redis contains cached notifications
- [ ] CORS working correctly
- [ ] Cookies persisting across requests

## Post-Deployment

### Custom Domain (Optional)

1. Go to Vercel project settings
2. Domains → Add domain
3. Follow DNS configuration steps
4. Update `NEXT_PUBLIC_*_URL` variables with new domains

### Security Enhancements

1. Rotate JWT_SECRET regularly
2. Use different MongoDB users for each service
3. Enable MongoDB Atlas encryption at rest
4. Set up Vercel password protection for staging
5. Enable rate limiting in production

## Support

If you encounter issues:
1. Check Vercel function logs
2. Check MongoDB Atlas logs
3. Verify all environment variables
4. Test services individually
5. Check network connectivity

## Congratulations! 🎉

Your Healthcare Appointment System is now live on Vercel!

