import type { Dispatch, SetStateAction, RefObject } from 'react';
declare global {
	type Post = {
		_id: string;
		title: string;
		author: string;
		image: string;
		content: string;
	};

	type User = {
		_id: string;
		createdAt: string;
		__v: number;
		email: string;
		firstName?: string;
		lastName?: string;
		roles: string[];
	};
	type LoginData = { email: string; password: string };

	type AuthContextType = {
		signedIn: boolean;
		user: User | null;
		handleSignIn: ({ email, password }: LoginData) => Promise<void>;
		handleSignOut: () => Promise<void>;
		handleRegister: (formState: RegisterFormState) => Promise<void>;
	};

	type RegisterFormState = {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
		confirmPassword: string;
	};
	type SetPosts = Dispatch<SetStateAction<Post[]>>;

	type MsgRoles = 'assistant' | 'user';

	type Message = {
		role: MsgRoles;
		content: string;
		_id: string;
	};

	type ChatRef = RefObject<HTMLDivElement | null>;

	type SetMessages = Dispatch<SetStateAction<Message[]>>;
	type SetChatId = Dispatch<SetStateAction<string | null>>;
	type SetLoading = Dispatch<SetStateAction<boolean>>;
}
