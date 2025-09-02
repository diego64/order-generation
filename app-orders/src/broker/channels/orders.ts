import { broker } from '../broker.ts'

export const orders = await broker.createChannel()

await orders.assertQueue('orders') /* Nome da Fila */