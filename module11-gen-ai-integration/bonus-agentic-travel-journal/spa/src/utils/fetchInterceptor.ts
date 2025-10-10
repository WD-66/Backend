const originalFetch = window.fetch;
const authServiceURL = import.meta.env.VITE_APP_AUTH_SERVER_URL;
if (!authServiceURL) {
	console.error('No Auth service set');
}

window.fetch = async (url, urlToHttpOptions, ...rest) => {
	let res = await originalFetch(
		url,
		{
			...urlToHttpOptions,
			credentials: 'include'
		},
		...rest
	);

	const authHeader = res.headers.get('www-authenticate');
	// console.log('authHeader', authHeader);
	if (authHeader?.includes('token_expired')) {
		console.log('ATTEMPT REFRESH');
		const refreshRes = await originalFetch(`${authServiceURL}/refresh`, {
			method: 'POST',
			credentials: 'include'
		});
		if (!refreshRes.ok) throw new Error('Login required');
		res = await originalFetch(
			url,
			{
				...urlToHttpOptions,
				credentials: 'include'
			},
			...rest
		);
	}

	return res;
};

export { authServiceURL };
