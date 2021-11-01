import client from './client';
import axios from 'axios';
import type {
	requestGroupDatesAPI,
	requestIndividualDatesAPI,
	postIndividualDatesAPI,
} from '../../interface';

export const getIndividualDates = ({
	user,
	id,
	uri,
	token,
}: requestIndividualDatesAPI) => {
	const headers = {
		'Content-type': 'Application/json',
		Authorization: `Token ${token}`,
		Accept: '*/*',
	};
	return axios.get(`${user}​/profiles​/${id}​/clubs​/${uri}​/individual`, {
		headers,
	});
};

export const getGroupDates = ({
	user,
	id,
	uri,
	token,
}: requestGroupDatesAPI) => {
	const headers = {
		'Content-type': 'Application/json',
		Authorization: `Token ${token}`,
		Accept: '*/*',
	};
	return client.get(`${user}​/profiles​/${id}​/clubs​/${uri}​/group`, {
		headers,
	});
};

export const postIndividualTime = ({
	user,
	id,
	uri,
	dates,
	token,
}: postIndividualDatesAPI) => {
	const headers = {
		'Content-type': 'Application/json',
		Authorization: `Token ${token}`,
		Accept: '*/*',
	};
	const data = JSON.stringify(dates);
	return client.post(`users/${user}/profiles/${id}/clubs/${uri}`, data, {
		headers,
	});
};
