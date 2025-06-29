import { Pool } from 'pg';

const databaseUrl = process.env.CUSTOMER_DATABASE_URL;
console.log('Database URL:', databaseUrl ? databaseUrl.substring(0, 50) + '...' : 'Not found');

const pool = new Pool({ connectionString: databaseUrl });

async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = $1', ['public']);
    console.log('Tables found:', result.rows.map(r => r.table_name));
    
    const channelResult = await client.query('SELECT COUNT(*) as count FROM channels');
    console.log('Channel count:', channelResult.rows[0].count);
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
}

testConnection();