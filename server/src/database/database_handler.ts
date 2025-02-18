import { Client } from 'pg';
import format from 'pg-format';
import { database_URL } from '../config';
import fs from 'fs';
import path from 'path';


const caPath = path.join(__dirname, '../../development_certificate.pem');

const client = new Client({
  connectionString: database_URL,
  ssl: {
    ca: fs.readFileSync(caPath).toString()
  }
});

const createInventoryItem = async (tableName: string, column1: string, column2: string)=> {
    try {
        await client.connect();
        console.log('Connected to the database');

        const query = format('CREATE TABLE %I (%I TEXT, %I TEXT);', tableName, column1, column2);

        await client.query(query);
        console.log(`Table "${tableName}" with columns "${column1}" and "${column2}" created successfully!`);

      } catch (error) {
        console.error('Error creating table:', error);
        
      } finally {
        await client.end();
        console.log('Disconnected from the database');

    }
};



if (require.main == module) {
    createInventoryItem('users', 'first_name', 'last_name');
  }