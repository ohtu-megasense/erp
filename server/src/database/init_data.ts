import { Client } from 'pg';
import { database_URL } from '../config';
import fs from 'fs';
import path from 'path';


const certificatePath = path.join(__dirname, "../../testenv_certificate.pem");

const client = new Client({
  connectionString: database_URL,
  ssl: {
    ca: fs.readFileSync(certificatePath).toString()
  }
});

const loadAnyCommandSchema = async () => {
    try {
      await client.connect();
      console.log("Connected to the database");

        const anyCommandSchemaPath = path.join(__dirname, "test_data.sql");
        const SQLschema = fs.readFileSync(anyCommandSchemaPath, "utf-8");

        await client.query(SQLschema);
        console.log("Updated the database");
    } finally {
        await client.end();
        console.log("Disconnected from the database");
    }
};


if (require.main == module) {
    loadAnyCommandSchema();
}
