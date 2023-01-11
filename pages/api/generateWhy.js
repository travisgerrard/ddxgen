import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateAction = async (req, res) => {
  const basePromptPrefix = `Generate a list of five differential diagnoses with the most likely first and the least likely last from the following history of present illness.

history of present illness:
${req.body.userInput}


differential diagnoses:
${req.body.apiOutput}

Why did you rank ${req.body.dx}
'`;

  // Run first prompt
  console.log(`API: ${basePromptPrefix}`);

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}\n`,
    temperature: 0.7,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
