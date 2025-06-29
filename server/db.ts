import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use customer's database if provided, otherwise fall back to default
const databaseUrl = process.env.CUSTOMER_DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

// Add query logging to identify the "No rows" issue
pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err);
});

export const db = drizzle(pool, { 
  schema,
  logger: {
    logQuery: (query, params) => {
      console.log('SQL Query:', query);
      if (params && params.length > 0) {
        console.log('SQL Params:', params);
      }
    }
  }
});