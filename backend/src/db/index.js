import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema.js'

const sqlite = new Database('lingo-challenge.db')
export const db = drizzle(sqlite, { schema })

export default db
