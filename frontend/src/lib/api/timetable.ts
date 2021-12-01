import client from './client';
import axios from 'axios';
import type {
	requestGroupDatesAPI,
	requestIndividualDatesAPI,
	postIndividualDatesAPI,
	postConfirmAPI,
	getSnapShotAPI,
} from '../../interface';
import { makeHeader } from '../util/header';
import { API_URL } from 'react-native-dotenv';
// 개인 시간 받아오기
export const getIndividualDates = ({
	user,
	id,
	uri,
	token,
}: requestIndividualDatesAPI) => {
	const headers = makeHeader(token);
	return client.get(
		`${API_URL}users/${user}/profiles/${id}/clubs/${uri}/individual`,
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
	const headers = makeHeader(token);
	return axios.get(
		`${API_URL}users/${user}/profiles/${id}/clubs/${uri}/group`,
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
	const headers = makeHeader(token);
	const data = JSON.stringify(dates);

	return axios.post(
		`${API_URL}users/${user}/profiles/${id}/clubs/${uri}`,
		data,
		{
			headers,
		}
	);
};

// 그룹 시간 개별 확정
export const postConfirm = ({ user, id, uri, date, token }: postConfirmAPI) => {
	const headers = makeHeader(token);
	const data = JSON.stringify(date);

	return axios.post(
		`${API_URL}users/${user}/profiles/${id}/clubs/${uri}/confirm/ok`,
		data,
		{
			headers,
		}
	);
};

// 스냅샷 확인
export const getSnapShot = ({ id, uri, user, token }: getSnapShotAPI) => {
	const headers = makeHeader(token);

	return axios.get(
		`${API_URL}users/${user}/profiles/${id}/clubs/${uri}/snapshot`,
		{ headers }
	);
};

// 스냅샷 생성
export const confirmSnapShot = ({ id, uri, user, token }: getSnapShotAPI) => {
	const headers = makeHeader(token);

	return axios.get(
		`${API_URL}users/${user}/profiles/${id}/clubs/${uri}/confirm`,
		{ headers }
	);
};
