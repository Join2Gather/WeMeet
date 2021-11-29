import client from './client';
import type {
	changeColorAPI,
	joinTeamAPI,
	requestTeamAPI,
	shareUriAPI,
} from '../../interface';
import { makeHeader } from '../util/header';
import axios from 'axios';
export const postTeamName = ({
	user,
	id,
	name,
	token,
	color,
	endTime,
	startTime,
}: requestTeamAPI) => {
	const headers = makeHeader(token);
	const data = JSON.stringify({
		name: encodeURIComponent(name),
		color: color,
		starting_hours: startTime,
		end_hours: endTime,
	});
	return client.post(`users/${user}/profiles/${id}/clubs`, data, { headers });
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

export const changeColor = ({
	user,
	id,
	token,
	uri,
	color,
}: changeColorAPI) => {
	const headers = makeHeader(token);
	const data = JSON.stringify({ color });
	return client.put(`/users/${user}/profiles/${id}/clubs/${uri}/color`, data, {
		headers,
	});
};
