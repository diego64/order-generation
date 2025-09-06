import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, {
  casing: 'snake_case',
})