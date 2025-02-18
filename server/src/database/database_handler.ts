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

const createInventoryItem = async (tableName: string, columns: Array<string>)=> {
  try {
      await client.connect();
      console.log('Connected to the database');
      
      let sql_text: string = 'CREATE TABLE %I (id SERIAL PRIMARY KEY, '
      for (var col of columns) {
        sql_text = sql_text + "%I TEXT, "
      }
      sql_text = sql_text.slice(0, -2);      // this removes the extra , and space
      sql_text = sql_text + ");";

      console.log(sql_text);
      console.log(tableName);
      console.log(columns);

      const query = format(sql_text, tableName, ...columns);

      await client.query(query);
      console.log(`Table "${tableName}" with columns ${columns} created successfully!`);

    } catch (error) {
      console.error('Error creating table:', error);
      
    } finally {
      await client.end();
      console.log('Disconnected from the database');

  }
};


const addToInventoryItem = async (tableName: string, values: Array<string>)=> {
  try {
      await client.connect();
      console.log('Connected to the database');

      let sql_text: string = 'INSERT INTO "%I" VALUES (DEFAULT, '
      for (var val of values) {
        sql_text = sql_text + "'%s', "
      }
      sql_text = sql_text.slice(0, -2);      // this removes the extra , and space
      sql_text = sql_text + ");";

      console.log(sql_text);
      console.log(tableName);
      console.log(values);

      const query = format(sql_text, tableName, ...values);

      await client.query(query);
      console.log(`Table "${tableName}" added values ${values}!`);


    } catch (error) {
      console.error('Error creating table:', error);
      
    } finally {
      await client.end();
      console.log('Disconnected from the database');

  }
};



if (require.main == module) {
    //createInventoryItem('users', ['first_name', 'last_name'])
    addToInventoryItem('users', ['santeri', 'kuusela']);
  }