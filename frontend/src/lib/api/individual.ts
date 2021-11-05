import axios from 'axios';
import client from './client';
import type {
	postImageAPI,
	loginEveryTimeAPI,
	postEveryTimeAPI,
} from '../../interface';
import FormData from 'form-data';
import { LOGIN_URL, IMAGE_URL } from 'react-native-dotenv';
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

	return axios.post(IMAGE_URL, formData, {
		headers,
	});
};

export const loginEveryTime = ({ id, password }: loginEveryTimeAPI) => {
	return axios.post(`${LOGIN_URL}?id=${id}&password=${password}`);
};

export const postEveryTime = ({ user, id, data, token }: postEveryTimeAPI) => {
	const sendData = JSON.stringify(data);
	const headers = {
		'Content-type': 'Application/json',
		Authorization: `Token ${token}`,
		Accept: '*/*',
	};
	return axios.post(
		`https://api.dps0340.xyz/users/${user}/profiles/${id}/everytime`,
		sendData,
		{ headers }
	);
};
