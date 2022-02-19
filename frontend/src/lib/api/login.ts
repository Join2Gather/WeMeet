import { makeHeader } from '../util/header';
import client from './client';
import type { appleLoginType, nicknameAPI, userMeAPI } from '../../interface';

export const getUserMe = ({ token }: userMeAPI) => {
	const headers = makeHeader(token);

	return client.get('users/me/', { headers });
};

export const changeNickname = ({ id, token, user, nickname }: nicknameAPI) => {
	const headers = makeHeader(token);
	const data = JSON.stringify({
		nickname
	});
	return client.put(`users/${user}/profiles/${id}/`, data, {
		headers
	});
};

export const appleLogin = ({ code, email }: appleLoginType) => {
	const headers = {
		'Content-type': 'Application/json',
		Accept: '*/*'
	};
	const data = JSON.stringify({
		code,
		email
	});
	return client.post('accounts/apple/login/token/', data, { headers });
};
