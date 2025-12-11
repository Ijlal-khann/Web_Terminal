const { Kafka } = require('kafkajs');
const handlers = require('./handlers');

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: process.env.KAFKA_BROKERS.split(','),
  ssl: true,
  sasl: {
    mechanism: process.env.KAFKA_SASL_MECHANISM || 'scram-sha-256',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD
  }
});

const consumeEvents = async (durationMs = 5000) => {
  const consumer = kafka.consumer({ 
    groupId: 'notification-group',
    sessionTimeout: 30000,
    heartbeatInterval: 3000
  });
  
  const messagesProcessed = [];
  
  try {
    await consumer.connect();
    console.log('Kafka consumer connected');
    
    await consumer.subscribe({ 
      topic: 'appointments', 
      fromBeginning: false 
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const event = JSON.parse(message.value.toString());
          console.log('Received event:', event.event);
          
          const handler = handlers[event.event];
          
          if (handler) {
            await handler(event.data);
            messagesProcessed.push(event.event);
          } else {
            console.log('No handler for event:', event.event);
          }
        } catch (error) {
          console.error('Message processing error:', error);
        }
      }
    });

    // Run for specified duration (Vercel timeout workaround)
    await new Promise(resolve => setTimeout(resolve, durationMs));

    return messagesProcessed;
  } catch (error) {
    console.error('Kafka consumer error:', error);
    throw error;
  } finally {
    await consumer.disconnect();
    console.log('Kafka consumer disconnected');
  }
};

module.exports = { consumeEvents };

