import { Client } from 'pg';
import { database_URL } from '../config';
import fs from 'fs';
import path from 'path';

const client = new Client({
  connectionString: database_URL
});

const loadSchema = async () => {
  try {
    await client.connect();
    console.log('Connected to the database');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const SQLschema = fs.readFileSync(schemaPath, 'utf-8');

    await client.query(SQLschema);
    console.log('Schema loaded successfully');
  } finally {
    await client.end();
    console.log('Disconnected from the database');
  }
};

if (require.main == module) {
  loadSchema();
}
