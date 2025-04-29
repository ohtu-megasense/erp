import { Router, Request, Response } from 'express';
import { pool } from '../database/database';
import logger from '../utils/logger';
import { deepseek_api_key } from '../config';
import { getCategoryNameAndItemShape } from '../database/database_handler';

const router: Router = Router();

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';


async function userQueryToSQL(userQuery: string) {
  try {

    const categories = await getCategoryNameAndItemShape();
    console.log("------------categories--------------");
    console.log(categories);
    console.log("------------categories--------------");
    
    const systemPrompt = {
      role: 'system',
      content: `
                You are a helpful assistant for ERP analytics.
                We need you to form an SQL query based on:
                1. user query
                2. database schema.sql
                3. array of categories and their item_shapes

                Here is the user query: "${userQuery}"

                Here is the database schema.sql provided down below:
          CREATE TABLE IF NOT EXISTS modules (
          id SERIAL PRIMARY KEY,
          module_name TEXT NOT NULL
       );

       CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          module_id INT REFERENCES modules (id),
          category_name TEXT NOT NULL,
          item_shape JSONB
       );

       CREATE TABLE IF NOT EXISTS items (
          id SERIAL PRIMARY KEY,
          category_id INT REFERENCES categories (id) ON DELETE CASCADE,
          item_data JSONB
       );
       
       Here is the array of categories and their jsonb item_shapes provided down below:
       ${JSON.stringify(categories, null, 2)}
       
       Please strictly send back ONLY the SQL do NOT add "sql" to the query and limit it to 100!
       `
    };

    console.log("--------------systemPrompt---------------");
    console.log(systemPrompt["content"]);
    console.log("--------------systemPrompt---------------");

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${deepseek_api_key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [systemPrompt]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Deepseek API error:', errorText);
      return;
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    console.log("---------reply--------");
    console.log(reply);
    console.log("---------reply--------");

    return reply;

  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('Chat error:', error.message);
    } else {
      logger.error('Chat error:', error);
    }
  }
}


router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages } = req.body;
    console.log("----req.body-----");
    console.log(req.body.messages.at(-1)["content"]);
    console.log("----req.body-----");


    if (!Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    const answer = await userQueryToSQL(req.body.messages.at(-1)["content"]);
    console.log("--------answer---------");
    console.log(`${answer}`);
    console.log("--------answer---------");


    const result = await pool.query(`${answer}`);
    const queryResults = JSON.stringify(result.rows, null, 2);

    const systemPrompt = {
      role: 'system',
      content: `You are a helpful assistant for analytics. Here is sample data from our ERP system:\n\n${queryResults}`
    };

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${deepseek_api_key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [systemPrompt, ...messages]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Deepseek API error:', errorText);
      res.status(502).json({ error: 'Failed to contact Deepseek API' });
      return;
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    res.json({ reply });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('Chat error:', error.message);
  
      if (error.message.includes("syntax error at or near")) {
        try {
          const systemPrompt = {
            role: 'system',
            content: `${req.body.messages.at(-1)["content"]}`
          };
  
          const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${deepseek_api_key}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'deepseek-chat',
              messages: [systemPrompt]
            })
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            logger.error('Deepseek recovery fetch failed:', errorText);
            res.status(502).json({ error: 'Deepseek error while handling fallback.' });
            return;
          }
  
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
  
          res.json({ reply });
          return; // important to stop execution here
        } catch (nestedError) {
          logger.error('Recovery flow failed:', nestedError);
          res.status(500).json({ error: 'Failed recovery from SQL error.' });
          return;
        }
      }
  
    } else {
      logger.error('Chat error (non-standard):', error);
    }
  
    res
      .status(500)
      .json({ error: 'Something went wrong with the chat request.' });
  }
});


export default router;
