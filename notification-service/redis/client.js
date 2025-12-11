const Redis = require('ioredis');

const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  retryStrategy(times) {
    if (times > 3) return null;
    return Math.min(times * 200, 1000);
  }
});

redis.on('error', (err) => console.error('Redis error:', err));
redis.on('connect', () => console.log('Redis connected'));

// Store notification with 7-day expiry
const addNotification = async (role, notification) => {
  try {
    const key = `notifications:${role}`;
    await redis.lpush(key, JSON.stringify(notification));
    await redis.expire(key, 604800);  // 7 days
    console.log(`Notification added to Redis for ${role}`);
  } catch (error) {
    console.error('Redis addNotification error:', error);
    throw error;
  }
};

// Get notifications for a role
const getNotifications = async (role, limit = 50) => {
  try {
    const key = `notifications:${role}`;
    const notifications = await redis.lrange(key, 0, limit - 1);
    return notifications.map(n => JSON.parse(n));
  } catch (error) {
    console.error('Redis getNotifications error:', error);
    return [];
  }
};

// Clear notifications for a role
const clearNotifications = async (role) => {
  try {
    const key = `notifications:${role}`;
    await redis.del(key);
    console.log(`Notifications cleared for ${role}`);
  } catch (error) {
    console.error('Redis clearNotifications error:', error);
  }
};

module.exports = { addNotification, getNotifications, clearNotifications };

