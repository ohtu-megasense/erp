import { Client } from 'pg';
import { database_URL } from '../config';
import fs from 'fs';
import path from 'path';


const caPath = path.join(__dirname, "../../development_certificate.pem");


const client = new Client({
  connectionString: database_URL,
  ssl: {
    ca: fs.readFileSync(caPath).toString()
  }
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

const resetDb = async () => {
  try {
    await client.connect();
    console.log('Connected to the database');

    const resetdbPath = path.join(__dirname, "resetdb.sql");     //   THIS WILL RESET THE DATABASE !!!
    const SQLresetdb = fs.readFileSync(resetdbPath, "utf-8");    //   THIS WILL RESET THE DATABASE !!!

    await client.query(SQLresetdb);
    console.log("Dropped all the tables");
  } finally {
    await client.end();
    console.log('Disconnected from the database');
  }
};

if (require.main == module) {
  loadSchema();
  //resetDb();                  //   THIS WILL RESET THE DATABASE !!!

}

