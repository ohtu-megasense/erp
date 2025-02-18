import { Client } from 'pg';
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

const createInventoryItem = async () => {
    const cols = ["sensors", "col1", "col2"];
    try {
        await client.connect();
        console.log('Connected to the database');

        const SQL = `DO
                    $$
                    BEGIN
                    EXECUTE format('CREATE TABLE %I 
                                  (id SERIAL PRIMARY KEY, %I TEXT, %I TEXT)', 
                                  'sensors', 'col1', 'col2'
                                  )
                    END;
                    $$ LANGUAGE PLPGSQL;`;

        await client.query(SQL, cols);
        console.log('Changes made');

    } finally {
        await client.end();
        console.log('Disconnected from the database');

    }
};



if (require.main == module) {
    createInventoryItem();
  }