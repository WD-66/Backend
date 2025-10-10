import ChatBubble from './ChatBubble';

type ChatProps = {
	messages: Message[];
	chatRef: ChatRef;
	loading: boolean;
};
const Chat = ({ messages, chatRef, loading }: ChatProps) => {
	const chatMessages = messages.filter(
		(msg) => (msg.role === 'assistant' && msg.content) || msg.role === 'user'
	);

	return (
		<div
			ref={chatRef}
			id='results'
			className='h-2/3 w-full p-8 bg-slate-600 rounded-lg shadow-md overflow-y-auto'
		>
			{chatMessages?.map((msg) => {
				return <ChatBubble key={msg._id} message={msg} />;
			})}

			{loading && (
				<div className='chat-start'>
					<div className='chat-image avatar'>
						<div className='w-10 rounded-full p-2 bg-slate-800'>Bot</div>
					</div>
					<div className='chat-bubble chat-bubble-secondary'>
						<span className='loading loading-spinner loading-md'></span>
						Thinking...
					</div>
				</div>
			)}
		</div>
	);
};

export default Chat;
