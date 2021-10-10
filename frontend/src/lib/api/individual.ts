import client from './client';
import axios from 'axios';
import type { postImageAPI } from '../../interface';
import FormData from 'form-data';
import { Platform } from 'react-native';
export const postImage = ({ image, token }: postImageAPI) => {
	const headers = {
		//'Content-type': 'multipart/formed-data',
		'Content-type': 'multipart/form-data',
		Authorization: `Token ${token}`,
		Accept: '*/*',
	};
	const formData = new FormData();
	formData.append('image', {
		uri: Platform.OS === 'android' ? image : image.replace('file://', ''),
		name: `image`,
		type: 'image/jpeg', // it may be necessary in Android.
	});

	return axios.post(`http://everytime.dps0340.xyz/everytime`, formData, {
		headers,
	});
};
