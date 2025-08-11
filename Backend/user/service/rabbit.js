const amqp = require('amqplib');
// require('dotenv').config({ path: '../.env' });

const RABBITMQ_URL = process.env.RABBIT_URL;

let connection, channel;

async function connect() {
    try {
        console.log("RABBITMQ_URL", RABBITMQ_URL);
        console.log("Connecting to RabbitMQ...");
        connection = await amqp.connect(RABBITMQ_URL);  // This supports amqps
        channel = await connection.createChannel();
        console.log("✅ Connected to RabbitMQ!");
    } catch (error) {
        console.error("❌ Failed to connect to RabbitMQ:", error.message);
        process.exit(1); // exit or retry
    }
}

async function subscribeToQueue(queueName, callback) {
    if (!channel) await connect();
    await channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, (message) => {
        callback(message.content.toString());
        channel.ack(message);
    });
}

async function publishToQueue(queueName, data) {
    if (!channel) await connect();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(data));
}

module.exports = {
    connect,
    subscribeToQueue,
    publishToQueue
};
