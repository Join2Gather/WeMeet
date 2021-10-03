import axios from 'axios';
import client from './client';
import type { requestTeamAPI } from '../../interface';

export const postTeamName = ({ user, id, name, token }: requestTeamAPI) => {
	const headers = {
		'Content-type': 'Application/json',
		Authorization: `Token ${token}`,
		Accept: '*/*',
	};
	const data = JSON.stringify({ name: encodeURIComponent(name) });
	return client.post(`/users/${user}/profiles/${id}/clubs`, data, { headers });
};
