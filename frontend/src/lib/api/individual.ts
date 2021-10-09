import client from './client';
import type { postImageAPI } from '../../interface';

export const postImage = ({ image, token }: postImageAPI) => {
	const headers = {
		'Content-type': 'multipart/formed-data',
		Authorization: `Token ${token}`,
		Accept: '*/*',
	};
	const data = JSON.stringify({ image: image });
	return client.post(`everytime`, data, { headers });
};
