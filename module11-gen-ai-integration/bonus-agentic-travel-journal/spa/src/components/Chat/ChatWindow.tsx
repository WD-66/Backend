/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { getChatHistory } from '@/data';
import ChatForm from './ChatForm';
import Chat from './Chat';
function ChatWindow() {
	// let us reference DOM element for scroll effect
	const chatRef = useRef<HTMLDivElement | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [chatId, setChatId] = useState<string | null>(
		localStorage.getItem('chatId')
	);
	// move loading state into parent component so we can add loading UI
	const [loading, setLoading] = useState(false);

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
	}, []);

	return (
		<div className='max-h-[75vh] max-w-[600px] flex flex-col bg-slate-600 rounded-lg'>
			<Chat chatRef={chatRef} messages={messages} loading={loading} />
			<ChatForm
				setMessages={setMessages}
				chatId={chatId}
				setChatId={setChatId}
				loading={loading}
				setLoading={setLoading}
			/>
			<ToastContainer autoClose={1500} theme='colored' />
		</div>
	);
}

export default ChatWindow;
