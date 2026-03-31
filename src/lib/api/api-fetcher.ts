function replaceVariables(template: string, variables: Record<string, string | number>): string {
	return template.replace(/{(\w+)}/g, (_, key) => {
		if (key in variables) {
			return String(variables[key]);
		}
		throw new Error(`Key ${key} not found in variables`);
	});
}

export function apiFetcher<T extends { token?: { jwt: string } }>(ctx: T) {
	return async (method: string, url: string, params?: any) => {
		const searchParams = new URLSearchParams(params?.query as Record<string, string>);
		const path = replaceVariables(url, params?.path);
		const headers = {
			...(['post', 'put', 'patch'].includes(method) && { 'Content-Type': 'application/json' }),
			...(ctx?.token?.jwt && { Authorization: `Bearer ${ctx.token.jwt}` })
		};
		return fetch(`${path}?${searchParams}`, {
			method: method.toUpperCase(),
			body: !['get', 'head'].includes(method) ? JSON.stringify(params?.body) : undefined,
			headers
		});
	};
}
