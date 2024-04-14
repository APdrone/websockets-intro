import express from 'express';
import { createClient } from 'redis';

const client = createClient();
const app = express();
app.use(express.json());

const port = 3000;

async function StartServer() {
  try {
    await client.connect();
    console.log('Connected to redis');

    app.listen(port, () => {
      console.log(`Server running on port${port}`);
    });
  } catch (err) {
    console.error(`Failed to connect to redis: ${err}`);
  }
}

app.post('/submit', async (req, res) => {
  const problemId = req.body.problemId;
  const code = req.body.code;
  const language = req.body.language;
  const userId = req.body.userId;

  //push to a DB

  try {
    await client.lPush('problems', JSON.stringify({ code, language, problemId, userId }));
    // Store in the database
    res.status(200).send('Submission received and stored.');
  } catch (error) {
    console.error('Redis error:', error);
    res.status(500).send('Failed to store submission.');
  }
});

StartServer();
