import type { RefObject, Dispatch, SetStateAction } from 'react';

export type MsgRoles =
	| 'assistant'
	| 'developer'
	| 'function'
	| 'system'
	| 'tool'
	| 'user';

export type Message = {
	role: MsgRoles;
	content: string;
	_id: string;
};

export type ChatRef = RefObject<HTMLDivElement | null>;

export type SetMessages = Dispatch<SetStateAction<Message[]>>;
export type SetChatId = Dispatch<SetStateAction<string | null>>;
