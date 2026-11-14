/*
 * Creates the PostgreSQL database named in .env (PGDATABASE, default "blackbox") if it doesn't exist.
 * Usage: npm run db:create
 */
require('dotenv/config');
const { Client } = require('pg');

const db = process.env.PGDATABASE || 'blackbox';

(async () => {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(db)) throw new Error(`Invalid database name: ${db}`);
  // connect to the default "postgres" database to be able to create another one
  const client = new Client({
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD,
    database: 'postgres',
  });
  await client.connect();
  const { rowCount } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [db]);
  if (rowCount) {
    console.log(`Database "${db}" already exists.`);
  } else {
    await client.query(`CREATE DATABASE "${db}" ENCODING 'UTF8'`);
    console.log(`Created database "${db}".`);
  }
  await client.end();
})().catch((e) => {
  console.error(`Could not create the database: ${e.message}`);
  if (e.code === '28P01') console.error('Wrong password: check PGPASSWORD in .env');
  if (e.code === 'ECONNREFUSED') console.error('PostgreSQL is not running on ' + (process.env.PGHOST || 'localhost') + ':' + (process.env.PGPORT || 5432));
  process.exit(1);
});
