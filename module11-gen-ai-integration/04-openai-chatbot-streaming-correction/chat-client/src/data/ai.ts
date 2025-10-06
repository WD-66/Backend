import type { Message } from '../types';
const AI_SERVER_URL = import.meta.env.VITE_AI_SERVER_URL;
if (!AI_SERVER_URL)
	throw new Error('AI_SERVER_URL is required, are you missing a .env file?');
const baseURL = `${AI_SERVER_URL}/ai`;

type ChatBody = {
	prompt: string;
	chatId?: string | null;
	stream: boolean;
};

type ChatRes = {
	completion: string;
	chatId: string;
};

type HistoryRes = {
	history: Message[];
	_id: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
};

const fetchChat = async (body: ChatBody): Promise<Response> => {
	const response = await fetch(`${baseURL}/chat`, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		const { message } = await response.json();
		throw new Error(message || 'Something went wrong');
	}
	return response;
};
const createChat = async (body: ChatBody): Promise<ChatRes> => {
	const response = await fetchChat(body);

	const data = (await response.json()) as ChatRes;

	return data;
};

const getChatHistory = async (chatId: string | null): Promise<HistoryRes> => {
	// fetch the appropriate endpoint, and storein a variable
	const res = await fetch(`${baseURL}/history/${chatId}`);

	if (!res.ok) {
		const { message } = await res.json();
		throw new Error(message || 'Something went wrong');
	}

	const data = (await res.json()) as HistoryRes;

	return data;
};

export { createChat, getChatHistory, fetchChat };
