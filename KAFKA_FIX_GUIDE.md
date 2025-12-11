# Kafka Authorization Error - Fix Guide

## Problem
You're seeing this error: **"Not authorized to access topics: [Topic authorization failed]"**

This means your Redpanda user doesn't have the correct permissions to read/write to the `appointments` topic.

---

## Solution: Fix Redpanda Permissions

### Step 1: Login to Redpanda Console
Go to: https://cloud.redpanda.com/

### Step 2: Navigate to Your Cluster
Click on your cluster: `healthcare-cluster`

### Step 3: Check/Create Topic
1. Go to **Topics** tab
2. Make sure `appointments` topic exists
3. If not, create it:
   - Name: `appointments`
   - Partitions: 3
   - Replication: Default

### Step 4: Fix User Permissions
1. Go to **Security** tab
2. Find your user: `healthcare-service`
3. Click **Edit** or **Manage Permissions**
4. Grant these permissions:
   - ✅ **READ** on topic `appointments`
   - ✅ **WRITE** on topic `appointments`
   - ✅ **DESCRIBE** on topic `appointments`
5. Save changes

### Step 5: Alternative - Create New User with Full Permissions
If editing doesn't work:
1. Go to **Security** → **Create User**
2. Username: `healthcare-admin`
3. Generate password → **COPY IT**
4. Grant permissions:
   - ✅ All operations on topic `appointments`
   - Or select **Admin** role
5. Update your `.env` files with new credentials

---

## Update .env Files (If you created new user)

Update these files with new credentials:

**`appointment-service/.env`:**
```env
KAFKA_USERNAME=healthcare-admin
KAFKA_PASSWORD=YOUR_NEW_PASSWORD
```

**`notification-service/.env`:**
```env
KAFKA_USERNAME=healthcare-admin
KAFKA_PASSWORD=YOUR_NEW_PASSWORD
```

---

## Restart Services After Fixing

After fixing Redpanda permissions:

1. **Stop all terminals** (Ctrl+C in each)
2. **Restart services**:
   ```bash
   # Terminal 1
   cd "D:\University\semester 7\Advanced Web\lab\lab-final\healthcare-system\auth-service"
   node api/index.js
   
   # Terminal 2
   cd "D:\University\semester 7\Advanced Web\lab\lab-final\healthcare-system\appointment-service"
   node api/index.js
   
   # Terminal 3
   cd "D:\University\semester 7\Advanced Web\lab\lab-final\healthcare-system\notification-service"
   node api/index.js
   
   # Terminal 4
   cd "D:\University\semester 7\Advanced Web\lab\lab-final\healthcare-system\client"
   npm run dev
   ```

---

## Test if Fixed

1. Login as patient
2. Book an appointment (now with doctor selection!)
3. Login as doctor
4. Click "Sync Notifications"
5. You should see: "Synced! Processed 1 messages"
6. Notification should appear

---

## Features Added/Fixed

✅ **Doctor Selection** - Patients can now choose which doctor to book with
✅ **Better Error Handling** - Kafka errors won't break the app
✅ **Doctor Column** - Doctor dashboard shows which doctor each appointment is for
✅ **Graceful Degradation** - App works even if Kafka is down

---

## If Kafka Still Doesn't Work

The app will still function! Notifications just won't be real-time via Kafka. You can:
1. Use MongoDB directly for notifications
2. Skip the notification feature for demo
3. Show that everything else works perfectly

---

## Quick Test Without Kafka

1. Book appointment as patient ✅
2. Login as doctor ✅
3. See appointment in list ✅
4. Approve appointment ✅
5. Patient sees updated status ✅

Everything works except the Kafka event notifications!

