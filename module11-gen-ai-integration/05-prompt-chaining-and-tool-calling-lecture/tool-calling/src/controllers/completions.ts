import type { RequestHandler } from 'express';
import { zodResponseFormat } from 'openai/helpers/zod';
import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources';
import OpenAI from 'openai';
import { type Pokemon } from 'pokedex-promise-v2';

import { getPokemon, returnError } from '#utils';
import { Intent, FinalResponse } from '#schemas';
import type { FinalResponseDTO, IncomingPrompt, ErrorResponseDTO } from '#types';

const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      strict: true,
      name: 'get_pokemon',
      description: 'Get details for a single Pokémon by name',
      parameters: {
        type: 'object',
        description: 'The name of the Pokémon to get details for',
        properties: {
          pokemonName: {
            type: 'string',
            description: 'The name of the Pokémon to get details for',
            example: 'Pikachu'
          }
        },
        required: ['pokemonName'],
        additionalProperties: false
      }
    }
  },
  {
    type: 'function',
    function: {
      strict: true,
      name: 'return_error',
      description: 'Return an error when the user asks something that is NOT about the weather.',
      parameters: {
        type: 'object',
        description: 'The reason why the question is not about Pokémon',
        properties: {
          message: {
            type: 'string',
            description: 'The reason why the question is not about Pokémon',
            example: 'This question is not about Pokémon.'
          }
        },
        required: ['message'],
        additionalProperties: false
      }
    }
  }
];

export const createCompletion: RequestHandler<unknown, FinalResponseDTO, IncomingPrompt> = async (
  req,
  res
) => {
  const { prompt, stream } = req.body;
  // console.log(prompt);
  const client = new OpenAI({
    apiKey:
      process.env.NODE_ENV === 'development'
        ? process.env.LOCAL_LLM_KEY
        : process.env.OPENAI_API_KEY,
    baseURL:
      process.env.NODE_ENV === 'development' ? process.env.LOCAL_LLM_URL : process.env.OPENAI_URL
  });

  const model =
    process.env.NODE_ENV === 'development'
      ? process.env.LOCAL_LLM_MODEL!
      : process.env.OPENAI_MODEL!;

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You determine if a question is about Pokémon. 
       If the user ask about a Pokémon, you will call the get_pokemon function to fetch data about it.
       If the question is not about Pokémon, you will call the return_error function with a reason why 
       the question is not about Pokémon.
      `
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  // Step 1: Check if the prompt is about Pokémon
  const checkIntentCompletion = await client.chat.completions.create({
    model,
    tools,
    tool_choice: 'auto',
    messages,
    temperature: 0
  });

  // console.log(checkIntentCompletion);

  // Check if the completion has a message
  const checkIntentCompletionMessage = checkIntentCompletion.choices[0]?.message;
  // Early return if no message is found
  if (!checkIntentCompletionMessage) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate a response from the model.'
    });
    return;
  }
  // console.log(checkIntentCompletionMessage);
  messages.push(checkIntentCompletionMessage);

  for (const toolCall of checkIntentCompletionMessage.tool_calls || []) {
    console.log(toolCall);
    if (toolCall.type === 'function') {
      const name = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
      console.log(`\x1b[36mTool call detected: ${name} with args: ${JSON.stringify(args)}\x1b[0m`);

      let result: Pokemon | ErrorResponseDTO | string = '';
      if (name === 'get_pokemon') {
        result = await getPokemon({ pokemonName: args.pokemonName });
      }
      if (name === 'return_error') {
        result = await returnError({ message: args.message });
      }

      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: result.toString()
      });
    }
  }
  // console.log(messages);

  // Step 2: Generate the final response using the enriched messages

  const finalCompletion = await client.chat.completions.parse({
    model,
    messages,
    temperature: 0,
    response_format: zodResponseFormat(FinalResponse, 'FinalResponse')
  });

  const finalResponse = finalCompletion.choices[0]?.message.parsed;

  if (!finalResponse) {
    res.status(500).json({
      completion: 'Failed to generate a final response.'
    });
    return;
  }

  res.json(finalResponse);
};
