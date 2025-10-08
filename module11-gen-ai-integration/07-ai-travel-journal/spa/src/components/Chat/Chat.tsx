import ChatBubble from './ChatBubble';

type ChatProps = {
	messages: Message[];
	chatRef: ChatRef;
};
const Chat = ({ messages, chatRef }: ChatProps) => {
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
		</div>
	);
};

export default Chat;
