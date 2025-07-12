// import { Pool } from 'pg';
// import { drizzle } from 'drizzle-orm/node-postgres';
// import * as schema from "@shared/schema";

// // Use customer's database for handover
// const databaseUrl = process.env.CUSTOMER_DATABASE_URL;

// console.log('Database URL being used:', databaseUrl ? 'CUSTOMER_DATABASE_URL is set' : 'CUSTOMER_DATABASE_URL is not set');

// if (!databaseUrl) {
//   throw new Error(
//     "DATABASE_URL must be set. Did you forget to provision a database?",
//   );
// }

// export const pool = new Pool({ 
//   connectionString: databaseUrl,
//   ssl: { rejectUnauthorized: false }
// });

// // Add query logging to identify the "No rows" issue
// pool.on('error', (err) => {
//   console.error('PostgreSQL pool error:', err);
// });

// export const db = drizzle(pool, { 
//   schema
// });

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// --- START: SERVERLESS-FRIENDLY CONNECTION LOGIC ---

// Declare a cached connection variable
let cachedPool: Pool | undefined;

// Function to get the pool
const getPool = () => {
  if (cachedPool) {
    // If the connection is already cached, reuse it
    return cachedPool;
  }

  // If not cached, create a new pool
  const databaseUrl = process.env.CUSTOMER_DATABASE_URL;

  console.log('Database URL being used:', databaseUrl ? 'CUSTOMER_DATABASE_URL is set' : 'CUSTOMER_DATABASE_URL is not set');

  if (!databaseUrl) {
    throw new Error(
      "CUSTOMER_DATABASE_URL must be set. Did you forget to add it to your Vercel project?",
    );
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  // Cache the pool
  cachedPool = pool;
  return pool;
};

// --- END: SERVERLESS-FRIENDLY CONNECTION LOGIC ---


// Export a single, cached instance of the pool and the db client
export const pool = getPool();

export const db = drizzle(pool, {
  schema
});