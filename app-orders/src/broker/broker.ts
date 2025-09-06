import amqp from 'amqplib';

if (!process.env.BROKER_URL) {
  throw new Error('BROKER_URL must be configured.');
}

export const broker = await amqp.connect(process.env.BROKER_URL);

export const ordersChannel = await broker.createChannel();

await ordersChannel.assertQueue('orders'); /* Nome da Fila */

console.log('[BROKER] Orders channel is ready');