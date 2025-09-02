import { fastify } from 'fastify'
import { randomUUID } from 'node:crypto'
import { fastifyCors } from '@fastify/cors'
import { z } from 'zod'
import { 
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { channels } from '../broker/channels/index.ts'
import { schema } from '../db/schema/index.ts'
import { db } from '../db/client.ts'
import { dispatchOrderCreated } from '../broker/messages/order-created.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {origin: '*'})

app.get('/health', () => {
  return 'OK'
})

app.post('/orders', {
  schema: {
    body: z.object({
      amount: z.coerce.number(),
    })
  }
}, async (request, reply) => {
  const { amount } = request.body
  
  console.log('Creating order with amount:', amount)

  const orderId = randomUUID()

  dispatchOrderCreated({
    orderId,
    amount,
    customer: {
      id: 'c02adfba-bd51-414e-ba7e-caa94c36c257'
    }
  })

  await db.insert(schema.orders).values({
    id: orderId,
    //customerId: randomUUID(),
    customerId: 'c02adfba-bd51-414e-ba7e-caa94c36c257',
    amount,
  })
})

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
  console.log('[ORDERS] HTTP SERVER RUNNING!')
})