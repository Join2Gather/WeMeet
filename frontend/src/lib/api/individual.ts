import axios from 'axios';
import client from './client';
import type {
	postImageAPI,
	loginEveryTimeAPI,
	postEveryTimeAPI
} from '../../interface';
import FormData from 'form-data';
// import { LOGIN_URL, IMAGE_URL, API_URL } from 'react-native-dotenv';
import { makeHeader } from '../util/header';
export const postImage = ({ image, token }: postImageAPI) => {
	const headers = makeHeader(token);
	const im = {
		uri: image,
		type: 'image/jpeg',
		name: 'myImage.jpg'
	};
	const formData = new FormData();
	formData.append('image', im);

	return axios.post(IMAGE_URL, formData, {
		headers
	});
};

export const loginEveryTime = ({ id, password }: loginEveryTimeAPI) => {
	return axios.post(`${LOGIN_URL}?id=${id}&password=${password}`);
};

export const postEveryTime = ({ user, id, data, token }: postEveryTimeAPI) => {
	const sendData = JSON.stringify(data);
	const headers = makeHeader(token);
	return client.post(`users/${user}/profiles/${id}/everytime`, sendData, {
		headers
	});
};
