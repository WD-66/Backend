import { useState, useRef, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import type { Message } from './types';
import { getChatHistory } from './data/ai';
import Form from './components/Form';
import Chat from './components/Chat';
function App() {
	// let us reference DOM element for scroll effect
	const chatRef = useRef<HTMLDivElement | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [chatId, setChatId] = useState<string | null>(
		localStorage.getItem('chatId')
	);

	// scroll to bottom of chat when new message is added
	useEffect(() => {
		chatRef.current?.lastElementChild?.scrollIntoView({
			behavior: 'smooth'
		});
	}, [messages]);

	useEffect(() => {
		const getAndSetChatHistory = async () => {
			try {
				// get the chat history with our function, store it in a variable
				const { history } = await getChatHistory(chatId);

				// update our messages state to the history
				setMessages(history);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (_error) {
				// remove the chatId from localstorage
				localStorage.removeItem('chatId');
			}
		};

		// call our function if chatId is truthy
		if (chatId) getAndSetChatHistory();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='h-screen container mx-auto p-5 flex flex-col justify-between gap-5'>
			<Chat chatRef={chatRef} messages={messages} />
			<Form setMessages={setMessages} chatId={chatId} setChatId={setChatId} />
			<ToastContainer autoClose={1500} theme='colored' />
		</div>
	);
}

export default App;
