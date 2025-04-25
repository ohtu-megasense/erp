import { Router, Request, Response } from 'express';
import { pool } from '../database/database';
import logger from '../utils/logger';
import { deepseek_api_key } from '../config';

const router: Router = Router();

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    const result = await pool.query(`
      SELECT item_data
      FROM items
      JOIN categories ON items.category_id = categories.id
      JOIN modules ON categories.module_id = modules.id
      WHERE modules.module_name = 'ride_sharing'
      ORDER BY items.id
      LIMIT 5;
    `);

    const rides = result.rows.map((row) => row.item_data);
    const rideSnippet = JSON.stringify(rides, null, 2);

    const systemPrompt = {
      role: 'system',
      content: `You are a helpful assistant for ride-sharing analytics. Here is sample ride data from our ERP system:\n\n${rideSnippet}`
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
    } else {
      logger.error('Chat error:', error);
    }
    res
      .status(500)
      .json({ error: 'Something went wrong with the chat request.' });
  }
});

export default router;
