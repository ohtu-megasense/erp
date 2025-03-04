import { Client } from 'pg';
import { database_URL } from '../config';
import fs from 'fs';
import path from 'path';


const client = new Client({
  connectionString: database_URL
});

const resetDb = async () => {
  try {
    await client.connect();
    console.log('Connected to the database');

    const resetdbPath = path.join(__dirname, 'resetdb.sql');
    const SQLresetdb = fs.readFileSync(resetdbPath, 'utf-8');

    await client.query(SQLresetdb);
    console.log('Dropped all the tables');
  } finally {
    await client.end();
    console.log('Disconnected from the database');
  }
};

//  !!! THIS WILL RESET THE DATABASE !!!
//  !!! THIS WILL RESET THE DATABASE !!!
//  !!! THIS WILL RESET THE DATABASE !!!

if (require.main == module) {
  resetDb(); // UNCOMMENT THIS IF YOU WISH TO RUN IT
}
