import { API_URL } from 'react-native-dotenv';
import axios from 'axios';
import { makeHeader } from '../util/header';
import client from './client';
import type { nicknameAPI, userMeAPI } from '../../interface';

export const getUserMe = ({ id, token, user }: userMeAPI) => {
	const headers = makeHeader(token);
	return client.get(`users/${user}/profiles/${id}/`, {
		headers,
	});
};

export const changeNickname = ({ id, token, user, nickname }: nicknameAPI) => {
	const headers = makeHeader(token);
	const data = JSON.stringify({
		nickname,
	});
	return client.put(`users/${user}/profiles/${id}/`, data, {
		headers,
	});
};
