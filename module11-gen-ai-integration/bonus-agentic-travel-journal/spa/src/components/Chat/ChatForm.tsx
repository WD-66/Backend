import {
	useState,
	type ChangeEventHandler,
	type FormEventHandler
} from 'react';
import { toast } from 'react-toastify';
import { createChat } from '@/data';

type FormProps = {
	setMessages: SetMessages;
	chatId: string | null;
	setChatId: SetChatId;
	loading: boolean;
	setLoading: SetLoading;
};

const Form = ({
	setMessages,
	setChatId,
	chatId,
	loading,
	setLoading
}: FormProps) => {
	const [prompt, setPrompt] = useState('');
	// moved to parent component so we can have loading UI in Chat
	// const [loading, setLoading] = useState(false);

	const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) =>
		setPrompt(e.target.value);

	const handleSubmit: FormEventHandler = async (e) => {
		try {
			e.preventDefault();
			// If the prompt value is empty, alert the user
			if (!prompt) throw new Error('Please enter a prompt');

			// Disable the submit button
			setLoading(true);

			const userMsg: Message = {
				role: 'user',
				content: prompt,
				_id: crypto.randomUUID()
			};
			setMessages((prev) => [...prev, userMsg]);
			const asstMsg: Message = {
				role: 'assistant',
				content: '',
				_id: crypto.randomUUID()
			};
			// pass chatId to createChat
			const response = await createChat({ prompt, chatId });
			// console.log(response);
			asstMsg.content = response.completion;
			setMessages((prev) => [...prev, asstMsg]);
			//set the chatId from the response in localstorage
			localStorage.setItem('chatId', response.chatId);
			// set  our chatId state based on the response
			setChatId(response.chatId);

			setPrompt('');
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('Failed to send message');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='h-1/3 w-full p-8 bg-slate-600 rounded-lg shadow-md'>
			<form onSubmit={handleSubmit}>
				<textarea
					value={prompt}
					onChange={handleChange}
					id='prompt'
					rows={5}
					placeholder='Ask me anything...'
					className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
				></textarea>
				<button
					id='submit'
					type='submit'
					className='mt-4 w-full btn btn-primary'
					disabled={loading}
				>
					Submit✨
				</button>
			</form>
		</div>
	);
};

export default Form;
