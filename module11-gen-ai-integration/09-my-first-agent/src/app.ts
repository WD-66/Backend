import { OpenAI } from 'openai';
import {
	Agent,
	run,
	setDefaultOpenAIClient,
	OpenAIChatCompletionsModel,
	tool,
	handoff,
	user,
	assistant,
	type RunContext,
	type InputGuardrail,
	InputGuardrailTripwireTriggered
} from '@openai/agents';
import { z } from 'zod';

import '#db';
import { Chat } from '#models';

// const prompt = 'What is the return policy for your pillows?';
// const prompt =
// 	'The pillows are too fluffy and I am not happy with my purchase.';

const prompt = 'That is not good enough, I want to speak to a manager.';
const chatId = '68e8c295780be733099da5db';

let currentChat = await Chat.findById(chatId);

if (!currentChat) {
	currentChat = await Chat.create({});
	console.log('chatId:', currentChat._id);
} else {
	console.log('chat history:', currentChat.history);
}

// add user message to database history
currentChat.history.push({
	role: 'user',
	content: prompt
});

const formattedHistory = currentChat.history.map((entry) =>
	entry.role === 'user' ? user(entry.content) : assistant(entry.content)
);

// Instantiate the OpenAI client with the API key and base URL from environment variables
// We do this so we can use OpenAI-compatible APIs like those provided by Ollama or LM Studio
// If undefined, say in production, it will use the default OpenAI API
const client = new OpenAI({
	apiKey:
		process.env.NODE_ENV === 'development' ? process.env.LLM_KEY : undefined,
	baseURL:
		process.env.NODE_ENV === 'development' ? process.env.LLM_URL! : undefined
});

// Set the default OpenAI client for the agent framework
// This register our custom client so that the agent can use it for making requests
// @ts-expect-error
setDefaultOpenAIClient(client);

// The Agents SDK uses the OpenAI Responses API under the hood, however it accept any valid Model type
// In development, we use the OpenAIChatCompletionsModel to register an OpenAI Chat Completions Model
// We do this so that we can use the OpenAI-compatible APIs provided by Ollama or LM Studio
const model =
	process.env.NODE_ENV === 'development'
		? // @ts-expect-error
		  new OpenAIChatCompletionsModel(client, process.env.LLM_MODEL!)
		: process.env.LLM_MODEL!;

const guardrailAgent = new Agent({
	name: 'Guardrail check',
	instructions:
		'We sell pillows. If the input is remotely about pillows return isNotAboutPillows: false, otherwise return true.',
	model,
	outputType: z.object({
		isNotAboutPillows: z.boolean(),
		reasoning: z.string()
	})
});
const pillowGuardrails: InputGuardrail = {
	name: 'Pillow Customer Support Guardrail',
	execute: async ({ input, context }) => {
		const result = await run(guardrailAgent, input, { context });
		return {
			outputInfo: result.finalOutput,
			tripwireTriggered: result.finalOutput?.isNotAboutPillows ?? false
		};
	}
};

const EscalationData = z.object({ reason: z.string() });
type EscalationDataType = z.infer<typeof EscalationData>;
const customerSupportAgent = new Agent({
	name: 'Customer Support Agent',
	instructions: `You are a customer support agent in a company that sells very fluffy pillows. 
                Be friendly, helpful. and concise.`,
	model
});

const escalationControlAgent = new Agent({
	name: 'Escalation Control Agent',
	instructions: `You are an escalation control agent that handles negative customer interactions. 
            If the customer is upset, you will apologize and offer to escalate the issue to a manager.
            Be friendly, helpful, reassuring and concise.`,
	model
});

const triageAgent = new Agent({
	name: 'Triage Agent',
	instructions: `If the question is about pillows, route it to the customer support agent. 
        If the customer's tone is negative, route it to the escalation control agent.
        `,
	model,
	inputGuardrails: [pillowGuardrails],
	// handoffs: [customerSupportAgent, escalationControlAgent]
	handoffs: [
		customerSupportAgent,
		handoff(escalationControlAgent, {
			inputType: EscalationData,
			onHandoff: async (
				ctx: RunContext<EscalationDataType>,
				input: EscalationDataType | undefined
			) => {
				console.log(`Handoff to Escalation Control Agent: ${input?.reason}`);
			}
		})
	]
});

// Run the agent with a specific task

try {
	// neutral tone
	const result = await run(triageAgent, formattedHistory);

	//negative tone
	// const result = await run(
	// 	triageAgent,
	// 	'The pillows are too fluffy and I am not happy with my purchase.'
	// );

	//off topic question

	// const result = await run(
	// 	triageAgent,
	// 	'What do you know about nuclear fusion?'
	// );

	if (result.finalOutput) {
		currentChat.history.push({
			role: 'assistant',
			content: result.finalOutput
		});
	}
	await currentChat.save();
	// Log the final output of the agent
	console.log(result.finalOutput);
} catch (error) {
	if (error instanceof InputGuardrailTripwireTriggered) {
		console.log(
			'Customer is not asking about pillows, or the input is not valid for the guardrail.'
		);
	} else {
		console.error('An error occurred:', error);
	}
}

// single agent with tool calling
// const pokemonTool = tool({
// 	name: 'pokemon_info',
// 	description: 'Get information about a Pokémon by name or ID',
// 	parameters: z.object({
// 		pokemon: z.string().describe('The name or ID of the Pokémon to look up')
// 	}),
// 	execute: async ({ pokemon }) => {
// 		console.log(`Looking up Pokémon: ${pokemon}`);
// 		return `${pokemon} is a Pokémon. I'll provide more details from my own knowledge.`;
// 	}
// });

// const agent = new Agent({
// 	name: 'Orchestrator Agent',
// 	instructions: `
// - You have ONE tool: pokemon_info. Use it ONLY if the user asks about a Pokémon.
// - For tacos: DO NOT use any tools. Answer with exactly a 3-line haiku (5-7-5).
// - For other topics: reply briefly, no tools.
// - Never invent tools. Only pokemon_info exists.
// `,
// 	model,
// 	tools: [pokemonTool]
// });

// const result = await run(agent, 'What is pikachu?');

// console.log(result.finalOutput);
