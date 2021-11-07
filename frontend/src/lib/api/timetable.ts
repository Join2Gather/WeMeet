import client from './client';
import axios from 'axios';
import type {
	requestGroupDatesAPI,
	requestIndividualDatesAPI,
	postIndividualDatesAPI,
} from '../../interface';

// 개인 시간 받아오기
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
	return client.get(
		`https://api.dps0340.xyz/users/${user}/profiles/${id}/clubs/${uri}/individual`,
		{
			headers,
		}
	);
};

// 팀 시간 받아오기
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
	return axios.get(
		`https://api.dps0340.xyz/users/${user}/profiles/${id}/clubs/${uri}/group`,
		{
			headers,
		}
	);
};

// 개인 시간 보내기
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

// 그룹 시간 개별 확정
export const postConfirm = ({ user, id, uri, dates, token }) => {
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
