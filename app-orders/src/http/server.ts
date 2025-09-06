import '@opentelemetry/auto-instrumentations-node/register'
import { trace } from '@opentelemetry/api'

import { fastify } from 'fastify'
import { randomUUID } from 'node:crypto'
import { setTimeout } from 'node:timers/promises'
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
import { tracer } from '../tracer/tracer.ts'

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

  await db.insert(schema.orders).values({
    id: orderId,
    //customerId: randomUUID(),
    customerId: '3ad66479-d801-4d46-b876-badfd7302686',
    amount,
  })

  const span = tracer.startSpan('Verificar log pois existe suspeita de alto tempo de espera')

  await setTimeout(2000)

  span.end()

  trace.getActiveSpan()?.setAttribute('order.id', orderId)

  dispatchOrderCreated({
    orderId,
    amount,
    customer: {
      id: '3ad66479-d801-4d46-b876-badfd7302686'
    },
  })

  return reply.status(201).send()
})

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
  console.log('[ORDERS] HTTP SERVER RUNNING!')
})