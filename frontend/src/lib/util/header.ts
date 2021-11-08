export function makeHeader(token: string) {
	return {
		'Content-type': 'Application/json',
		Authorization: `Token ${token}`,
		Accept: '*/*',
	};
}
