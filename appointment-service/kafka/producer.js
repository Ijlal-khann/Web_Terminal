const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'appointment-service',
  brokers: process.env.KAFKA_BROKERS.split(','),
  ssl: true,
  sasl: {
    mechanism: process.env.KAFKA_SASL_MECHANISM || 'scram-sha-256',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD
  }
});

const sendEvent = async (topic, event) => {
  const producer = kafka.producer();
  
  try {
    await producer.connect();
    console.log('Kafka producer connected');
    
    await producer.send({
      topic,
      messages: [{ 
        value: JSON.stringify(event),
        timestamp: Date.now().toString()
      }]
    });
    
    console.log('Event sent:', event.event);
  } catch (error) {
    console.error('Kafka producer error:', error);
    throw error;
  } finally {
    await producer.disconnect();
    console.log('Kafka producer disconnected');
  }
};

module.exports = { sendEvent };

