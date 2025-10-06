import {
	useState,
	type ChangeEventHandler,
	type FormEventHandler
} from 'react';
import { toast } from 'react-toastify';
import type { Message, SetMessages, SetChatId } from '../types';
import { createChat, fetchChat } from '../data/ai';

type FormProps = {
	setMessages: SetMessages;
	chatId: string | null;
	setChatId: SetChatId;
};

const Form = ({ setMessages, setChatId, chatId }: FormProps) => {
	const [prompt, setPrompt] = useState('');
	const [loading, setLoading] = useState(false);
	const [isStream, setIsStream] = useState(false);

	const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) =>
		setPrompt(e.target.value);

	const toggleChecked = () => setIsStream((prev) => !prev);

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

			if (isStream) {
				// process the stream
				const res = await fetchChat({ prompt, chatId, stream: isStream });
				const reader = res.body!.getReader();
				const decoder = new TextDecoder();

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					// console.log('done, value: ', done, value);
					const chunk = decoder.decode(value, { stream: true });
					// console.log(chunk);
					const lines = chunk.split('\n');
					// console.log(lines);

					const dataLines = lines.filter((line) => line.startsWith('data:'));

					// console.log(dataLines);
					dataLines.forEach((line) => {
						const jsonStr = line.replace('data:', '');
						// console.log(jsonStr);
						const data = JSON.parse(jsonStr);
						console.log(data);

						// if data has chatId property
						//
						// update localstorage and chatId state
						//
						// else if data has text property
						//
						// update messages state
						// (in the state setter) check if the message already exists
						//  if it exists, add the the newest piece of text
						// else create a new message, and add it to the end of the messages array
					});
				}
			} else {
				// pass chatId to createChat
				const response = await createChat({ prompt, chatId, stream: isStream });
				// console.log(response);
				asstMsg.content = response.completion;
				setMessages((prev) => [...prev, asstMsg]);
				//set the chatId from the response in localstorage
				localStorage.setItem('chatId', response.chatId);
				// set  our chatId state based on the response
				setChatId(response.chatId);

				setPrompt('');
			}
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
				<label className='flex gap-2 items-center my-2'>
					<input
						type='checkbox'
						className='checkbox checkbox-primary'
						checked={isStream}
						onChange={toggleChecked}
						disabled={loading}
					/>
					<span>Stream response?</span>
				</label>
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
