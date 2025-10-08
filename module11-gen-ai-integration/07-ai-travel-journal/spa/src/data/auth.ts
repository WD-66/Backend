import { authServiceURL } from '@/utils';

type SuccessRes = { message: string };

const login = async (formData: LoginData): Promise<SuccessRes> => {
	const res = await fetch(`${authServiceURL}/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
	});
	if (!res.ok) throw new Error('Something went wrong!');

	const data = (await res.json()) as SuccessRes;

	return data;
};

const me = async (): Promise<User> => {
	const res = await fetch(`${authServiceURL}/me`);

	if (!res.ok) throw new Error('Something went wrong!');

	const { user } = (await res.json()) as SuccessRes & { user: User };

	return user;
};
const logout = async (): Promise<SuccessRes> => {
	const res = await fetch(`${authServiceURL}/logout`, {
		method: 'DELETE'
	});

	if (!res.ok) throw new Error('Something went wrong!');

	const data = (await res.json()) as SuccessRes;

	return data;
};

const register = async (formData: RegisterFormState): Promise<SuccessRes> => {
	const res = await fetch(`${authServiceURL}/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
	});
	if (!res.ok) throw new Error('Something went wrong!');

	const data = (await res.json()) as SuccessRes;

	return data;
};

export { login, me, logout, register };
