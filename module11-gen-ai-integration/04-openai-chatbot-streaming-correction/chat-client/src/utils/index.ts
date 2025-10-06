import type { Message } from '../types';

const addOrUpdateMsg = (
	msgs: Message[],
	asstMsg: Message,
	chunkText: string
) => {
	// (in the state setter) check if the message already exists
	const msgExists = msgs.some((msg) => msg._id === asstMsg._id);
	let updatedState: Message[] = [];
	//  if it exists, add the the newest piece of text
	if (msgExists) {
		// add the new text chunk
		updatedState = msgs.map((msg) =>
			msg._id === asstMsg._id
				? { ...msg, content: msg.content + chunkText }
				: msg
		);
	} else {
		// else create a new message, and add it to the end of the messages array
		asstMsg.content = chunkText;
		updatedState = [...msgs, asstMsg];
	}
	return updatedState;
};

export { addOrUpdateMsg };
