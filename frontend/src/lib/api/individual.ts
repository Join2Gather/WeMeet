import axios from 'axios';
import type { postImageAPI } from '../../interface';
import FormData from 'form-data';
export const postImage = ({ image, token }: postImageAPI) => {
	const headers = {
		'Content-type': 'multipart/form-data',
		Authorization: `Token ${token}`,
		Accept: '*/*',
	};
	const im = {
		uri: image,
		type: 'image/jpeg',
		name: 'myImage.jpg',
	};
	const formData = new FormData();
	formData.append('image', im);

	return axios.post(`http://everytime.dps0340.xyz/everytime`, formData, {
		headers,
	});
};
