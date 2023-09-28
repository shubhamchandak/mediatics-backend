import * as amqp from 'amqplib';

const queueName = 'ml-queue';

export async function publishMessage(message: any) {
  try {
    const connection = await amqp.connect(process.env.AMQP_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName);
    console.log(`Sending to queue: ${message}`);
    const res = channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log(`Sent: '${message}', queue_response: ${res}`);
    
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

// async function consumeMessage() {
//     try {
//       const connection = await amqp.connect(process.env.AMQP_URL);
//       const channel = await connection.createChannel();
    
//       await channel.assertQueue(queueName);
  
//       console.log('Waiting for messages...');
  
//       channel.consume(queueName, (message: any) => {
//         if (message !== null) {
//           const content = message.content.toString();
//           console.log(`Received: '${content}'`);
//           channel.ack(message);
//         }
//       });
//     } catch (error) {
//       console.error('Error:', error);
//     }
// }
  
// consumeMessage();
