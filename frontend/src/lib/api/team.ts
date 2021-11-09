import client from './client';
import type { joinTeamAPI, requestTeamAPI, shareUriAPI } from '../../interface';
import { makeHeader } from '../util/header';
import axios from 'axios';
export const postTeamName = ({ user, id, name, token }: requestTeamAPI) => {
	const headers = makeHeader(token);
	const data = JSON.stringify({ name: encodeURIComponent(name) });
	return client.post(`/users/${user}/profiles/${id}/clubs`, data, { headers });
};

export const joinTeam = ({ user, id, token, uri }: joinTeamAPI) => {
	const headers = makeHeader(token);
	const data = null;
	return client.post(`/users/${user}/profiles/${id}/clubs/${uri}/join`, data, {
		headers,
	});
};

export const shareUri = ({ user, id, token, uri }: shareUriAPI) => {
	const headers = makeHeader(token);
	const data = null;
	return client.post(`/users/${user}/profiles/${id}/clubs/${uri}/share`, data, {
		headers,
	});
};
