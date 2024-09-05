import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit process with failure
  });

// Ensure the client is disconnected on process exit
process.on('exit', () => {
  db.end().then(() => console.log('Disconnected from the database'));
});

export default db;
