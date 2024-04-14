import { createClient } from 'redis';

const client = createClient();

type Tsubmission = {
  key: string;
  element: string;
};

async function processSubmission(submission: string) {
  const { problemId, code, language } = JSON.parse(submission);

  console.log(`Processing submission for problemId ${problemId}...`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);
  // Here you would add your actual processing logic

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Finished processing submission for problemId ${problemId}.`);
}

async function startWorker() {
  try {
    await client.connect();
    console.log('Worker connected to redis');

    while (true) {
      try {
        const submission: string = await client.brPop('problems', 0);
        console.log('submissions', submission, typeof submission);
        await processSubmission(submission.element);
      } catch (err) {
        console.log(`Error processing submissions:${err}`);
      }
    }
  } catch (err) {
    console.error('Failed to connect to redis', err);
  }
}

startWorker();
