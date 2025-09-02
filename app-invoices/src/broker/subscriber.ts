import { orders } from "./channels/orders.ts";

orders.consume('orders', async message => {
  if (!message) {
    return null
  }

  console.log(message?.content.toString())

  orders.ack(message)
}, {
  noAck: false, // Possui o controle de verificar se a mensagem deu erro
})

// acknowledge => reconhecer