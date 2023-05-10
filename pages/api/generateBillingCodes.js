import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateAction = async (req, res) => {
  const GPT35TurboMessage = [
    {
      role: 'system',
      content: `You are a medical billing expert. From the following history of present illness what diagnosis codes would you include.`,
    },
    {
      role: 'user',
      content: req.body.userInput,
    },
  ];

  let GPT35Turbo = async (message) => {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: message,
    });

    return response.data.choices[0].message.content;
  };

  const output = await GPT35Turbo(GPT35TurboMessage);
  console.log(output);

  res.status(200).json({ output });
};

export default generateAction;
